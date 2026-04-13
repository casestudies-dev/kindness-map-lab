import { useState } from "react";
import { useMaps, useDeleteMap } from "@/hooks/useMaps";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { ExternalLink, Code, RefreshCw, Trash2, MapPin, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const MapsPage = () => {
  const { data: maps, isLoading } = useMaps();
  const deleteMap = useDeleteMap();
  const { toast } = useToast();
  const [embedSlug, setEmbedSlug] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

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

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground font-heading">Maps</h1>
      <p className="text-muted-foreground mt-1 mb-6">Manage your globes and maps.</p>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="p-6"><Skeleton className="h-40 w-full" /></CardContent></Card>
          ))}
        </div>
      ) : !maps?.length ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No maps yet</p>
            <p className="text-sm mt-1">Connect a Stripe account to create your first map.</p>
          </CardContent>
        </Card>
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
