import { useState } from "react";
import { NavigationHeader } from "@/components/dashboard/navigation-header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { ChartsSection } from "@/components/dashboard/charts-section";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AnalyticsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [timeRange, setTimeRange] = useState("6m");

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
                <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
                <p className="text-gray-600 mt-1">Detailed insights and performance metrics</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Select value={timeRange} onValueChange={setTimeRange}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1m">1 Month</SelectItem>
                    <SelectItem value="3m">3 Months</SelectItem>
                    <SelectItem value="6m">6 Months</SelectItem>
                    <SelectItem value="1y">1 Year</SelectItem>
                    <SelectItem value="2y">2 Years</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline">
                  Export Report
                </Button>
              </div>
            </div>

            {/* Stats Overview */}
            <StatsOverview />

            {/* Main Charts */}
            <ChartsSection />

            {/* Additional Analytics */}
            <AnalyticsCharts timeRange={timeRange} />
          </div>
        </main>
      </div>
    </div>
  );
}