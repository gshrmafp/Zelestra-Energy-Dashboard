import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

interface SettingsFormData {
  applicationName: string;
  applicationDescription: string;
  defaultItemsPerPage: number;
  enableNotifications: boolean;
  enableAutoSync: boolean;
  syncInterval: number;
}

export function SettingsForm() {
  const { toast } = useToast();
  
  const form = useForm<SettingsFormData>({
    defaultValues: {
      applicationName: "Renewable Energy Platform",
      applicationDescription: "Monitor and manage renewable energy projects",
      defaultItemsPerPage: 10,
      enableNotifications: true,
      enableAutoSync: false,
      syncInterval: 30,
    },
  });

  const onSubmit = (data: SettingsFormData) => {
    // Here you would typically save to backend
    toast({
      title: "Settings saved",
      description: "Your application settings have been updated successfully.",
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="applicationName">Application Name</Label>
              <Input
                id="applicationName"
                {...form.register("applicationName")}
                placeholder="Enter application name"
              />
            </div>

            <div>
              <Label htmlFor="applicationDescription">Description</Label>
              <Input
                id="applicationDescription"
                {...form.register("applicationDescription")}
                placeholder="Enter application description"
              />
            </div>

            <div>
              <Label htmlFor="defaultItemsPerPage">Default Items Per Page</Label>
              <Input
                id="defaultItemsPerPage"
                type="number"
                min="5"
                max="100"
                {...form.register("defaultItemsPerPage", { valueAsNumber: true })}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enableNotifications"
                checked={form.watch("enableNotifications")}
                onCheckedChange={(checked) => form.setValue("enableNotifications", checked)}
              />
              <Label htmlFor="enableNotifications">Enable Notifications</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="enableAutoSync"
                checked={form.watch("enableAutoSync")}
                onCheckedChange={(checked) => form.setValue("enableAutoSync", checked)}
              />
              <Label htmlFor="enableAutoSync">Enable Auto Sync</Label>
            </div>

            {form.watch("enableAutoSync") && (
              <div>
                <Label htmlFor="syncInterval">Sync Interval (minutes)</Label>
                <Input
                  id="syncInterval"
                  type="number"
                  min="5"
                  max="1440"
                  {...form.register("syncInterval", { valueAsNumber: true })}
                />
              </div>
            )}

            <Button type="submit" className="bg-primary-500 hover:bg-primary-600">
              Save Settings
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}