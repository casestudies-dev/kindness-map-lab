import { useState } from "react";
import { useSources, useDisconnectSource } from "@/hooks/useSources";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Database, CheckCircle, XCircle, RefreshCw, Unlink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

const SourcesPage = () => {
  const { data: sources, isLoading } = useSources();
  const disconnect = useDisconnectSource();
  const { toast } = useToast();
  const [disconnectId, setDisconnectId] = useState<string | null>(null);

  const handleDisconnect = async () => {
    if (!disconnectId) return;
    try {
      await disconnect.mutateAsync(disconnectId);
      toast({ title: "Source disconnected" });
    } catch {
      toast({ title: "Failed to disconnect", variant: "destructive" });
    }
    setDisconnectId(null);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground font-heading">Sources</h1>
      <p className="text-muted-foreground mt-1 mb-6">Manage connected data sources for your maps.</p>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
      ) : !sources?.length ? (
        <Card>
          <CardContent className="p-12 text-center text-muted-foreground">
            <Database className="h-12 w-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">No sources</p>
            <p className="text-sm mt-1">Create a map first, then connect a data source.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {sources.map((source) => (
            <Card key={source.clientId}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-heading">{source.companyName || source.slug}</CardTitle>
                  {source.key ? (
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200">
                      <CheckCircle className="h-3 w-3 mr-1" /> Connected
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <XCircle className="h-3 w-3 mr-1" /> Not connected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Source type</p>
                    <p className="font-medium">Stripe</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Map</p>
                    <p className="font-medium">{source.slug}.mappio.org</p>
                  </div>
                  {source.key && (
                    <>
                      <div>
                        <p className="text-muted-foreground text-xs">Last synced</p>
                        <p className="font-medium">
                          {source.key.last_used
                            ? new Date(source.key.last_used).toLocaleDateString()
                            : "Never"}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground text-xs">Key created</p>
                        <p className="font-medium">{new Date(source.key.created_at).toLocaleDateString()}</p>
                      </div>
                    </>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" disabled>
                    Reconnect
                  </Button>
                  {source.key && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toast({ title: "Refresh triggered", description: `Refreshing ${source.slug}…` })}
                      >
                        <RefreshCw className="h-3.5 w-3.5 mr-1" /> Refresh now
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-destructive"
                        onClick={() => setDisconnectId(source.key!.id)}
                      >
                        <Unlink className="h-3.5 w-3.5 mr-1" /> Disconnect
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={!!disconnectId} onOpenChange={() => setDisconnectId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Disconnect Source</DialogTitle>
            <DialogDescription>The map will stay but will stop auto-refreshing. You can reconnect later.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDisconnectId(null)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDisconnect} disabled={disconnect.isPending}>
              {disconnect.isPending ? "Disconnecting…" : "Disconnect"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SourcesPage;
