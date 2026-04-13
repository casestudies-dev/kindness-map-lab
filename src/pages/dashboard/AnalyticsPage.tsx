import { useMaps } from "@/hooks/useMaps";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Globe, Users, MousePointer, Code } from "lucide-react";

const AnalyticsPage = () => {
  const { data: maps } = useMaps();

  const lastUpdated = maps?.length
    ? new Date(Math.max(...maps.map((m) => new Date(m.updated_at).getTime()))).toLocaleString()
    : "—";

  const placeholderCards = [
    { title: "Globe Views", desc: "Total iframe loads", icon: Globe },
    { title: "Unique Visitors", desc: "Deduped by IP/session", icon: Users },
    { title: "Top Locations Clicked", desc: "Most clicked cause/country cards", icon: MousePointer },
    { title: "Embed Locations", desc: "Domains embedding the globe", icon: Code },
  ];

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground font-heading">Analytics</h1>
      <p className="text-muted-foreground mt-1 mb-6">Track your map performance.</p>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-heading flex items-center gap-2">
            <BarChart3 className="h-4 w-4" /> Last Updated
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{lastUpdated}</p>
          <p className="text-xs text-muted-foreground mt-1">Most recent data refresh across all maps</p>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {placeholderCards.map((card) => (
          <Card key={card.title} className="opacity-60">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-heading flex items-center gap-2">
                  <card.icon className="h-4 w-4" /> {card.title}
                </CardTitle>
                <Badge variant="secondary">Coming soon</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-muted-foreground">—</p>
              <p className="text-xs text-muted-foreground mt-1">{card.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsPage;
