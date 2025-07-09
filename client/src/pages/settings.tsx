import { useState } from "react";
import { NavigationHeader } from "@/components/dashboard/navigation-header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { SettingsForm } from "@/components/settings/settings-form";
import { ApiKeysSection } from "@/components/settings/api-keys-section";
import { NotificationsSection } from "@/components/settings/notifications-section";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Key, Bell, Shield } from "lucide-react";
import { useAuthContext } from "@/components/auth/auth-provider";
import { Redirect } from "wouter";

export default function SettingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAdmin } = useAuthContext();

  if (!isAdmin) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader onSearchChange={setSearchQuery} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Page Header */}
            <div className="mb-8">
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600 mt-1">Manage application settings and configurations</p>
            </div>

            {/* Settings Content */}
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="general" className="flex items-center space-x-2">
                  <Settings className="w-4 h-4" />
                  <span>General</span>
                </TabsTrigger>
                <TabsTrigger value="api" className="flex items-center space-x-2">
                  <Key className="w-4 h-4" />
                  <span>API Keys</span>
                </TabsTrigger>
                <TabsTrigger value="notifications" className="flex items-center space-x-2">
                  <Bell className="w-4 h-4" />
                  <span>Notifications</span>
                </TabsTrigger>
                <TabsTrigger value="security" className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Security</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="general" className="mt-6">
                <SettingsForm />
              </TabsContent>
              
              <TabsContent value="api" className="mt-6">
                <ApiKeysSection />
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-6">
                <NotificationsSection />
              </TabsContent>
              
              <TabsContent value="security" className="mt-6">
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Security Settings</h3>
                  <p className="text-gray-600">Security configuration options will be available here.</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}