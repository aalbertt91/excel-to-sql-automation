import { Settings as SettingsIcon, Bell, User, Shield, Moon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function Settings() {
  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-foreground">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold">Settings</h2>
          <p className="text-muted-foreground mt-1">Manage your workspace preferences</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-primary" /> Profile
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-sm font-medium">Display Name</label>
              <div className="p-3 bg-secondary/50 rounded-lg text-sm">Admin User</div>
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Email</label>
              <div className="p-3 bg-secondary/50 rounded-lg text-sm">admin@hub.com</div>
            </div>
          </div>
        </div>
        
        <Separator />
        
        <div className="p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <Bell className="w-5 h-5 text-primary" /> Notifications
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Project Updates</p>
                <p className="text-sm text-muted-foreground">Get notified when a project status changes</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Weekly Digest</p>
                <p className="text-sm text-muted-foreground">Summary of your automation activity</p>
              </div>
              <Switch />
            </div>
          </div>
        </div>

        <Separator />

        <div className="p-6">
          <h3 className="text-lg font-semibold flex items-center gap-2 mb-6">
            <Shield className="w-5 h-5 text-primary" /> Appearance
          </h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Dark Mode</p>
              <p className="text-sm text-muted-foreground">Switch between light and dark themes</p>
            </div>
            <Switch />
          </div>
        </div>

        <div className="bg-secondary/20 p-6 flex justify-end gap-3">
          <Button variant="outline">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  );
}
