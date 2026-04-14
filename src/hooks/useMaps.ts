import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ClientMap {
  id: string;                // maps.id
  slug: string;              // organisations.slug
  company_name: string;      // organisations.name
  hq_location: string;
  hq_lat: number;
  hq_lng: number;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  organisation_id: string;
}

export function useMaps() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["maps", user?.id],
    queryFn: async () => {
      // Get all organisations owned by this user
      const { data: orgs, error: orgErr } = await supabase
        .from("organisations")
        .select("id, slug, name")
        .eq("owner_id", user!.id);
      if (orgErr) throw orgErr;
      if (!orgs?.length) return [];

      // Fetch all maps for those orgs
      const orgIds = orgs.map((o) => o.id);
      const { data: maps, error: mapErr } = await supabase
        .from("maps")
        .select("*")
        .in("organisation_id", orgIds)
        .order("updated_at", { ascending: false });
      if (mapErr) throw mapErr;

      // Merge in the org slug + name so existing UI code keeps working
      const orgById = new Map(orgs.map((o) => [o.id, o]));
      return (maps ?? []).map((m: any) => {
        const org = orgById.get(m.organisation_id);
        return {
          ...m,
          slug: org?.slug ?? m.slug,
          company_name: org?.name ?? "",
        } as ClientMap;
      });
    },
    enabled: !!user,
  });
}

export function useDeleteMap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (mapId: string) => {
      // Get the map's org, then delete the map (data_sources cascade)
      const { data: map } = await supabase
        .from("maps")
        .select("organisation_id")
        .eq("id", mapId)
        .single();

      const { error } = await supabase.from("maps").delete().eq("id", mapId);
      if (error) throw error;

      // If this was the org's last map, also delete the org
      if (map) {
        const { data: remaining } = await supabase
          .from("maps")
          .select("id")
          .eq("organisation_id", map.organisation_id);
        if (!remaining?.length) {
          await supabase.from("organisations").delete().eq("id", map.organisation_id);
        }
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maps"] });
    },
  });
}
