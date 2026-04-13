import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ClientMap {
  id: string;
  slug: string;
  company_name: string;
  hq_location: string;
  hq_lat: number;
  hq_lng: number;
  config: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export function useMaps() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["maps", user?.id],
    queryFn: async () => {
      const { data: ownerships, error: ownerError } = await supabase
        .from("client_owners")
        .select("client_id")
        .eq("user_id", user!.id);
      if (ownerError) throw ownerError;
      if (!ownerships?.length) return [];

      const clientIds = ownerships.map((o) => o.client_id);
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .in("id", clientIds)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data as ClientMap[];
    },
    enabled: !!user,
  });
}

export function useDeleteMap() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (clientId: string) => {
      // Delete keys first, then client_owners, then client
      await supabase.from("client_keys").delete().eq("client_id", clientId);
      await supabase.from("client_owners").delete().eq("client_id", clientId);
      const { error } = await supabase.from("clients").delete().eq("id", clientId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["maps"] });
    },
  });
}
