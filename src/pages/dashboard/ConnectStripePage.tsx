import { useState, useRef, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ExternalLink, Copy, Check, Lock, ChevronRight } from "lucide-react";

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
}

interface ConnectResponse {
  success: boolean;
  slug: string;
  globeUrl: string;
  embedCode: string;
}

const ConnectStripePage = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [companyName, setCompanyName] = useState("");
  const [hqLocation, setHqLocation] = useState("");
  const [hqLat, setHqLat] = useState<number | null>(null);
  const [hqLng, setHqLng] = useState<number | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [locationPicked, setLocationPicked] = useState(false);

  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const locationRef = useRef<HTMLDivElement>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ConnectResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Close suggestions on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (locationRef.current && !locationRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const searchLocation = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 2) {
      setSuggestions([]);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=5&addressdetails=1`,
          { headers: { "User-Agent": "Mappio/1.0" } }
        );
        const data: NominatimResult[] = await res.json();
        setSuggestions(data);
        setShowSuggestions(data.length > 0);
      } catch {
        setSuggestions([]);
      }
    }, 300);
  }, []);

  const selectLocation = (item: NominatimResult) => {
    setHqLocation(item.display_name);
    setHqLat(parseFloat(item.lat));
    setHqLng(parseFloat(item.lon));
    setLocationPicked(true);
    setShowSuggestions(false);
    setFieldErrors((prev) => ({ ...prev, hqLocation: "" }));
  };

  const validate = () => {
    const errors: Record<string, string> = {};
    if (!companyName.trim()) errors.companyName = "Company name is required.";
    if (!hqLocation.trim()) errors.hqLocation = "HQ location is required.";
    else if (!locationPicked || hqLat === null) errors.hqLocation = "Please select a location from the suggestions.";
    if (!apiKey.trim()) errors.apiKey = "API key is required.";
    else if (!apiKey.startsWith("rk_")) errors.apiKey = "Please use a restricted key (starts with rk_).";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!validate()) return;

    setSubmitting(true);
    try {
      const res = await fetch("https://api.mappio.org/api/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          apiKey,
          companyName: companyName.trim(),
          hqLocation: hqLocation.trim(),
          hqLat,
          hqLng,
          userId: user?.id,
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      // Owner linking is handled server-side via userId in the request

      setResult(data as ConnectResponse);
    } catch {
      setError("Network error — please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const copyEmbed = () => {
    if (!result) return;
    navigator.clipboard.writeText(result.embedCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({ title: "Copied to clipboard" });
  };

  if (result) {
    return (
      <div className="max-w-xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center space-y-6">
            <div className="text-4xl">🌍</div>
            <h2 className="text-xl font-semibold text-foreground font-heading">Your globe is ready!</h2>
            <Button asChild>
              <a href={result.globeUrl} target="_blank" rel="noopener noreferrer">
                View your globe <ExternalLink className="h-4 w-4 ml-1" />
              </a>
            </Button>
            <div className="text-left space-y-2">
              <Label className="text-sm text-muted-foreground">Embed code</Label>
              <div className="relative">
                <pre className="bg-muted rounded-md p-4 text-xs overflow-auto whitespace-pre-wrap">
                  {result.embedCode}
                </pre>
                <Button size="sm" variant="outline" className="absolute top-2 right-2" onClick={copyEmbed}>
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
            </div>
            <Button variant="outline" onClick={() => navigate("/dashboard")}>
              Go to dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto">
      <Link to="/dashboard/sources" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to Sources
      </Link>

      <h1 className="text-2xl font-semibold text-foreground font-heading mb-6">Connect Stripe</h1>

      {/* Instructions */}
      <Card className="mb-6">
        <CardContent className="p-5 space-y-3">
          <p className="text-sm font-medium text-foreground">How to get your restricted key:</p>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">1</span>
              <span>Go to <strong className="text-foreground">Stripe Dashboard → Developers → API Keys → Create Restricted Key</strong></span>
            </div>
            <div className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">2</span>
              <span>Enable only <strong className="text-foreground">Customers: Read</strong> permission. Leave everything else as "None".</span>
            </div>
            <div className="flex gap-2">
              <span className="shrink-0 w-5 h-5 rounded-full bg-primary/10 text-primary text-xs flex items-center justify-center font-medium">3</span>
              <span>Copy the key (starts with <code className="bg-muted px-1 rounded text-xs">rk_</code>) and paste it below.</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="mb-4 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Company Name */}
        <div className="space-y-2">
          <Label htmlFor="companyName">Company name</Label>
          <Input
            id="companyName"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            placeholder="Acme Inc"
          />
          {fieldErrors.companyName && <p className="text-xs text-destructive">{fieldErrors.companyName}</p>}
        </div>

        {/* HQ Location */}
        <div className="space-y-2" ref={locationRef}>
          <Label htmlFor="hqLocation">HQ location</Label>
          <Input
            id="hqLocation"
            value={hqLocation}
            onChange={(e) => {
              setHqLocation(e.target.value);
              setLocationPicked(false);
              setHqLat(null);
              setHqLng(null);
              searchLocation(e.target.value);
            }}
            placeholder="London, United Kingdom"
            autoComplete="off"
          />
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute z-50 mt-1 w-full max-w-[calc(100%-3rem)] bg-popover border border-border rounded-md shadow-md overflow-hidden">
              {suggestions.map((s, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground truncate"
                  onClick={() => selectLocation(s)}
                >
                  {s.display_name}
                </button>
              ))}
            </div>
          )}
          {fieldErrors.hqLocation && <p className="text-xs text-destructive">{fieldErrors.hqLocation}</p>}
        </div>

        {/* API Key */}
        <div className="space-y-2">
          <Label htmlFor="apiKey">Restricted API key</Label>
          <Input
            id="apiKey"
            type="password"
            value={apiKey}
            onChange={(e) => {
              setApiKey(e.target.value);
              if (fieldErrors.apiKey) setFieldErrors((prev) => ({ ...prev, apiKey: "" }));
            }}
            placeholder="rk_live_..."
          />
          {fieldErrors.apiKey && <p className="text-xs text-destructive">{fieldErrors.apiKey}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={submitting}>
          {submitting ? "Connecting…" : "Connect Stripe"}
          {!submitting && <ChevronRight className="h-4 w-4 ml-1" />}
        </Button>

        <p className="text-xs text-muted-foreground flex items-start gap-1.5">
          <Lock className="h-3.5 w-3.5 mt-0.5 shrink-0" />
          Your key is encrypted with AES-256 the instant it reaches our server. We only read customer countries — never payment data. Revoke access anytime from your Stripe dashboard.
        </p>
      </form>
    </div>
  );
};

export default ConnectStripePage;
