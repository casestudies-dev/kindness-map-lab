import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export interface ClientKey {
  id: string;
  client_id: string;
  encrypted_key: string;
  created_at: string;
  last_used: string | null;
}

export interface SourceWithMap {
  clientId: string;
  companyName: string;
  slug: string;
  key: ClientKey | null;
}

export function useSources() {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["sources", user?.id],
    queryFn: async () => {
      const { data: ownerships, error: ownerError } = await supabase
        .from("client_owners")
        .select("client_id")
        .eq("user_id", user!.id);
      if (ownerError) throw ownerError;
      if (!ownerships?.length) return [];

      const clientIds = ownerships.map((o) => o.client_id);

      const [clientsRes, keysRes] = await Promise.all([
        supabase.from("clients").select("id, company_name, slug").in("id", clientIds),
        supabase.from("client_keys").select("*").in("client_id", clientIds),
      ]);

      if (clientsRes.error) throw clientsRes.error;
      if (keysRes.error) throw keysRes.error;

      const keysMap = new Map<string, ClientKey>();
      keysRes.data?.forEach((k) => keysMap.set(k.client_id, k as ClientKey));

      return (clientsRes.data || []).map((c) => ({
        clientId: c.id,
        companyName: c.company_name,
        slug: c.slug,
        key: keysMap.get(c.id) || null,
      })) as SourceWithMap[];
    },
    enabled: !!user,
  });
}

export function useDisconnectSource() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (keyId: string) => {
      const { error } = await supabase.from("client_keys").delete().eq("id", keyId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sources"] });
    },
  });
}
