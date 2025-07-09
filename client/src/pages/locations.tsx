import { useState } from "react";
import { NavigationHeader } from "@/components/dashboard/navigation-header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { LocationsMap } from "@/components/locations/locations-map";
import { LocationsList } from "@/components/locations/locations-list";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, List } from "lucide-react";

export default function LocationsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader onSearchChange={setSearchQuery} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Locations</h1>
                <p className="text-gray-600 mt-1">Geographic distribution of renewable energy projects</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Button variant="outline">
                  Export Locations
                </Button>
              </div>
            </div>

            {/* Locations Content */}
            <Tabs defaultValue="map" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-md">
                <TabsTrigger value="map" className="flex items-center space-x-2">
                  <Map className="w-4 h-4" />
                  <span>Map View</span>
                </TabsTrigger>
                <TabsTrigger value="list" className="flex items-center space-x-2">
                  <List className="w-4 h-4" />
                  <span>List View</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="map" className="mt-6">
                <LocationsMap searchQuery={searchQuery} />
              </TabsContent>
              
              <TabsContent value="list" className="mt-6">
                <LocationsList searchQuery={searchQuery} />
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
}