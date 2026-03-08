import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h2 className="page-header">Settings</h2>

      <div className="max-w-xl bg-card rounded-lg border shadow-sm p-6 space-y-4">
        <h3 className="font-semibold">Shop Information</h3>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Shop Name</label>
          <Input defaultValue="Auto Spare Manager" />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Phone</label>
          <Input defaultValue="+91 98765 43210" />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Address</label>
          <Input defaultValue="123 Main Road, Chennai" />
        </div>
        <div>
          <label className="text-sm font-medium text-muted-foreground">Low Stock Threshold (default)</label>
          <Input type="number" defaultValue="10" />
        </div>
        <Button>Save Settings</Button>
      </div>
    </div>
  );
}
