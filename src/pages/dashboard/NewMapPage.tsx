import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard, FileSpreadsheet, Globe } from "lucide-react";

const CREATION_OPTIONS = [
  {
    id: "stripe",
    icon: CreditCard,
    title: "Connect via Stripe",
    description: "Link your Stripe account to automatically create a map from your customer data.",
    href: "/dashboard/sources/stripe",
    available: true,
  },
  {
    id: "manual",
    icon: FileSpreadsheet,
    title: "Build manually / CSV",
    description: "Upload a CSV or manually add locations to build your map from scratch.",
    available: false,
  },
  {
    id: "website",
    icon: Globe,
    title: "Import from website",
    description: "We'll scan your website to automatically detect and map your locations.",
    available: false,
  },
];

export default function NewMapPage() {
  const navigate = useNavigate();

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard")} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to maps
      </Button>

      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-foreground font-heading">Create a new map</h1>
        <p className="text-muted-foreground mt-1">Choose how you'd like to get started.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {CREATION_OPTIONS.map((opt) => (
          <Card
            key={opt.id}
            className={`transition-colors ${
              opt.available
                ? "cursor-pointer hover:border-primary/40 hover:bg-accent/50"
                : "opacity-50 cursor-not-allowed"
            }`}
            onClick={() => opt.available && opt.href && navigate(opt.href)}
          >
            <CardContent className="p-6 text-center space-y-3">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <opt.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="text-base font-semibold text-foreground">{opt.title}</h3>
              <p className="text-sm text-muted-foreground">{opt.description}</p>
              {!opt.available && (
                <p className="text-xs text-muted-foreground italic">Coming soon</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
