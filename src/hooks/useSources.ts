import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface DataSource {
  id: string;
  map_id: string;
  provider: string;
  encrypted_credentials: string | null;
  created_at: string;
  last_synced: string | null;
}

export interface SourceWithMap {
  clientId: string;          // map id (keeping the name for UI compatibility)
  companyName: string;       // organisation name
  slug: string;              // organisation slug
  key: DataSource | null;
}

export function useSources() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sources", user?.id],
    queryFn: async () => {
      // Get user's organisations
      const { data: orgs, error: orgErr } = await supabase
        .from("organisations")
        .select("id, slug, name")
        .eq("owner_id", user!.id);
      if (orgErr) throw orgErr;
      if (!orgs?.length) return [];

      const orgIds = orgs.map((o) => o.id);
      const orgById = new Map(orgs.map((o) => [o.id, o]));

      // Get all maps for those orgs
      const { data: maps, error: mapErr } = await supabase
        .from("maps")
        .select("id, organisation_id")
        .in("organisation_id", orgIds);
      if (mapErr) throw mapErr;
      if (!maps?.length) return [];

      const mapIds = maps.map((m) => m.id);
      const orgByMap = new Map(maps.map((m) => [m.id, m.organisation_id]));

      // Get all data sources for those maps
      const { data: sources, error: srcErr } = await supabase
        .from("data_sources")
        .select("*")
        .in("map_id", mapIds);
      if (srcErr) throw srcErr;

      const sourceByMap = new Map<string, DataSource>();
      sources?.forEach((s) => sourceByMap.set(s.map_id, s as DataSource));

      // Build one SourceWithMap per map
      return maps.map((m) => {
        const org = orgById.get(m.organisation_id);
        return {
          clientId: m.id,
          companyName: org?.name || "",
          slug: org?.slug || "",
          key: sourceByMap.get(m.id) || null,
        };
      }) as SourceWithMap[];
    },
    enabled: !!user,
  });
}

export function useDisconnectSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sourceId: string) => {
      const { error } = await supabase.from("data_sources").delete().eq("id", sourceId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sources"] });
    },
  });
}
