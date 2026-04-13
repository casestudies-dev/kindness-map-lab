import { useState, useEffect } from "react";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";
import { useMaps, useDeleteMap } from "@/hooks/useMaps";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";

const SettingsPage = () => {
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const { user, signOut } = useAuth();
  const { data: maps } = useMaps();
  const deleteMap = useDeleteMap();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setCompanyName(profile.company_name || "");
    }
  }, [profile]);

  const handleSaveProfile = async () => {
    try {
      await updateProfile.mutateAsync({ name, email, company_name: companyName });
      toast({ title: "Profile updated" });
    } catch {
      toast({ title: "Failed to update profile", variant: "destructive" });
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== "DELETE") return;
    try {
      // Delete all owned maps
      if (maps) {
        for (const map of maps) {
          await deleteMap.mutateAsync(map.id);
        }
      }
      // Delete profile
      await supabase.from("profiles").delete().eq("id", user!.id);
      await signOut();
      navigate("/");
      toast({ title: "Account deleted" });
    } catch {
      toast({ title: "Failed to delete account", variant: "destructive" });
    }
    setShowDeleteDialog(false);
  };

  const handleExport = () => {
    if (!maps?.length) return;
    const data = maps.map((m) => ({ slug: m.slug, company_name: m.company_name, config: m.config }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mappio-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground font-heading">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-heading">Profile</CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="settings-email">Email</Label>
            <Input id="settings-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>
            {updateProfile.isPending ? "Saving…" : "Save changes"}
          </Button>
        </CardContent>
      </Card>

      {/* Company */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-heading">Company</CardTitle>
          <CardDescription>Your organisation details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" value={companyName} onChange={(e) => setCompanyName(e.target.value)} />
          </div>
          <Button onClick={handleSaveProfile} disabled={updateProfile.isPending}>Save</Button>
        </CardContent>
      </Card>

      {/* Map defaults */}
      <Card className="opacity-60">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base font-heading">Map Defaults</CardTitle>
            <Badge variant="secondary">Coming soon</Badge>
          </div>
          <CardDescription>Default arc colour, background, and more</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Customise default map settings for new globes.</p>
        </CardContent>
      </Card>

      {/* Danger zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-base font-heading text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Export data</p>
              <p className="text-xs text-muted-foreground">Download all map configs as JSON</p>
            </div>
            <Button variant="outline" size="sm" onClick={handleExport} disabled={!maps?.length}>
              Export
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Delete account</p>
              <p className="text-xs text-muted-foreground">Permanently delete your account and all maps</p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => setShowDeleteDialog(true)}>
              Delete account
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Account</DialogTitle>
            <DialogDescription>
              This will permanently delete your profile, all maps, and all API keys. Type DELETE to confirm.
            </DialogDescription>
          </DialogHeader>
          <Input value={deleteConfirm} onChange={(e) => setDeleteConfirm(e.target.value)} placeholder="Type DELETE" />
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancel</Button>
            <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleteConfirm !== "DELETE"}>
              Delete everything
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SettingsPage;
