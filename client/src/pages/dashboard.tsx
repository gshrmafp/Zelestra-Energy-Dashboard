import { useState } from "react";
import { NavigationHeader } from "@/components/dashboard/navigation-header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { ProjectsTable } from "@/components/dashboard/projects-table";
import { Button } from "@/components/ui/button";
import { useAuthContext } from "@/components/auth/auth-provider";

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const { isAdmin } = useAuthContext();

  return (
    <div className="min-h-screen bg-gray-50">
      <NavigationHeader onSearchChange={setSearchQuery} />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Renewable Energy Dashboard</h1>
                <p className="text-gray-600 mt-1">Monitor renewable energy projects and capacity trends</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Button variant="outline">
                  Export Data
                </Button>
                {isAdmin && (
                  <Button className="bg-primary-500 hover:bg-primary-600">
                    Add Project
                  </Button>
                )}
              </div>
            </div>

            {/* Stats Overview */}
            <StatsOverview />

            {/* Charts Section */}
            <ChartsSection />

            {/* Projects Table */}
            <ProjectsTable searchQuery={searchQuery} />
          </div>
        </main>
      </div>
    </div>
  );
}
