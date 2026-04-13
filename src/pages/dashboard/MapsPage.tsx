import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMaps, useDeleteMap } from "@/hooks/useMaps";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ExternalLink, Code, RefreshCw, Trash2, MapPin, Eye, Plus, CreditCard, FileSpreadsheet, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const CREATION_OPTIONS = [
  {
    id: "stripe",
    icon: CreditCard,
    title: "Connect via Stripe",
    description: "Link your Stripe account to automatically create a map from your customer data.",
    href: "/dashboard/sources/stripe",
  },
  {
    id: "manual",
    icon: FileSpreadsheet,
    title: "Build manually / CSV",
    description: "Upload a CSV or manually add locations to build your map from scratch.",
  },
  {
    id: "website",
    icon: Globe,
    title: "Import from website",
    description: "We'll scan your website to automatically detect and map your locations.",
  },
];

const MapsPage = () => {
  const navigate = useNavigate();
  const { data: maps, isLoading } = useMaps();
  const deleteMap = useDeleteMap();
  const { toast } = useToast();
  const [embedSlug, setEmbedSlug] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showNewMap, setShowNewMap] = useState(false);

  const getLocationsCount = (config: Record<string, unknown>) => {
    const locations = config?.locations;
    return Array.isArray(locations) ? locations.length : 0;
  };

  const getViewsCount = (config: Record<string, unknown>) => {
    const views = config?.views;
    return Array.isArray(views) ? views.length : 0;
  };

  const embedCode = (slug: string) =>
    `<iframe\n  src="https://${slug}.mappio.org"\n  width="100%"\n  height="600"\n  style="border: none; border-radius: 16px; overflow: hidden;"\n  loading="lazy"\n  title="Map — ${slug}"\n></iframe>`;

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteMap.mutateAsync(deleteId);
      toast({ title: "Map deleted" });
    } catch {
      toast({ title: "Failed to delete map", variant: "destructive" });
    }
    setDeleteId(null);
  };

  const CreationOptions = () => (
    <div className="grid gap-4 md:grid-cols-3">
      {CREATION_OPTIONS.map((opt) => (
        <Card
          key={opt.id}
          className="cursor-pointer transition-colors hover:border-primary/40 hover:bg-accent/50"
          onClick={() => {
            setShowNewMap(false);
            if ("href" in opt && opt.href) navigate(opt.href);
          }}
        >
          <CardContent className="p-4 text-center space-y-2">
            <div className="mx-auto w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
              <opt.icon className="h-4 w-4 text-primary" />
            </div>
            <h3 className="text-sm font-semibold text-foreground">{opt.title}</h3>
            <p className="text-sm text-muted-foreground">{opt.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground font-heading">Maps</h1>
          <p className="text-muted-foreground mt-1">Manage your globes and maps.</p>
        </div>
        <Button onClick={() => setShowNewMap(true)}>
          <Plus className="h-4 w-4 mr-1" /> New map
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : !maps?.length ? (
        <div className="space-y-4">
          <div className="text-center mb-8">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-40 text-muted-foreground" />
            <p className="text-lg font-medium text-foreground">No maps yet</p>
            <p className="text-sm text-muted-foreground mt-1">Choose how you'd like to create your first map.</p>
          </div>
          <CreationOptions />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {maps.map((map) => (
            <Card key={map.id} className="flex flex-col">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-heading">{map.company_name || map.slug}</CardTitle>
                <p className="text-xs text-muted-foreground">{map.slug}.mappio.org</p>
              </CardHeader>
              <CardContent className="flex-1 space-y-2 text-sm">
                <div className="aspect-video rounded-md border border-border overflow-hidden bg-muted">
                  <iframe
                    src={`https://${map.slug}.mappio.org`}
                    className="w-full h-full pointer-events-none"
                    loading="lazy"
                    title={map.company_name}
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="secondary">
                    <MapPin className="h-3 w-3 mr-1" />
                    {getLocationsCount(map.config)} locations
                  </Badge>
                  <Badge variant="secondary">
                    <Eye className="h-3 w-3 mr-1" />
                    {getViewsCount(map.config)} views
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  Updated {new Date(map.updated_at).toLocaleDateString()}
                </p>
              </CardContent>
              <CardFooter className="flex gap-2 flex-wrap pt-0">
                <Button size="sm" variant="outline" asChild>
                  <a href={`https://${map.slug}.mappio.org`} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-3.5 w-3.5 mr-1" /> View
                  </a>
                </Button>
                <Button size="sm" variant="outline" disabled>Edit</Button>
                <Button size="sm" variant="outline" onClick={() => setEmbedSlug(map.slug)}>
                  <Code className="h-3.5 w-3.5 mr-1" /> Embed
                </Button>
                <Button size="sm" variant="outline" onClick={() => toast({ title: "Refresh triggered", description: `Refreshing ${map.slug}…` })}>
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
                <Button size="sm" variant="outline" className="text-destructive" onClick={() => setDeleteId(map.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* New map modal */}
      <Dialog open={showNewMap} onOpenChange={setShowNewMap}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create a new map</DialogTitle>
            <DialogDescription>Choose how you'd like to get started.</DialogDescription>
          </DialogHeader>
          <CreationOptions />
        </DialogContent>
      </Dialog>

      {/* Embed modal */}
      <Dialog open={!!embedSlug} onOpenChange={() => setEmbedSlug(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Embed Code</DialogTitle>
            <DialogDescription>Copy and paste this snippet into your website.</DialogDescription>
          </DialogHeader>
          <pre className="bg-muted rounded-md p-4 text-xs overflow-auto whitespace-pre-wrap">
            {embedSlug && embedCode(embedSlug)}
          </pre>
          <DialogFooter>
            <Button onClick={() => {
              navigator.clipboard.writeText(embedCode(embedSlug!));
              toast({ title: "Copied to clipboard" });
              setEmbedSlug(null);
            }}>
              Copy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete confirmation */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Map</DialogTitle>
            <DialogDescription>This will permanently delete this map and its API keys. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleteMap.isPending}>
              {deleteMap.isPending ? "Deleting…" : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MapsPage;
