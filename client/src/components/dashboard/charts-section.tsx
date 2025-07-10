import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useChartData } from "@/hooks/use-projects";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Calendar, TrendingUp, Eye, FileSpreadsheet, Download } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { getAuthHeaders } from "@/lib/auth";

// Import Chart.js
declare const Chart: any;

export function ChartsSection() {
  const { data: chartData, isLoading } = useChartData();
  const [capacityTimeRange, setCapacityTimeRange] = useState("monthly");
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const capacityChartRef = useRef<HTMLCanvasElement>(null);
  const distributionChartRef = useRef<HTMLCanvasElement>(null);
  const capacityChartInstance = useRef<any>(null);
  const distributionChartInstance = useRef<any>(null);

  // Function to handle Excel export
  const handleExcelExport = async () => {
    try {
      const headers = getAuthHeaders();
      const response = await fetch('/api/projects/export/excel', {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Failed to export data');
      }
      
      // Get the blob from the response
      const blob = await response.blob();
      
      // Create a download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'renewable_energy_projects.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export Successful",
        description: "Data has been exported to Excel format.",
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export Failed",
        description: "Could not export data to Excel. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!chartData) return;

    // Load Chart.js if not already loaded
    if (typeof Chart === 'undefined') {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
      script.onload = () => {
        initCharts();
      };
      document.head.appendChild(script);
    } else {
      initCharts();
    }

    function initCharts() {
      // Generate data based on time range
      const generateCapacityData = () => {
        if (capacityTimeRange === "yearly") {
          return {
            labels: ['2020', '2021', '2022', '2023', '2024'],
            data: [800, 1200, 1600, 2100, 2800]
          };
        } else {
          return {
            labels: chartData.capacityTrends.map((d: {month: string; capacity: number}) => d.month),
            data: chartData.capacityTrends.map((d: {month: string; capacity: number}) => d.capacity)
          };
        }
      };

      // Capacity trends chart
      if (capacityChartRef.current) {
        if (capacityChartInstance.current) {
          capacityChartInstance.current.destroy();
        }
        
        const capacityData = generateCapacityData();
        const ctx = capacityChartRef.current.getContext('2d');
        capacityChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: capacityData.labels,
            datasets: [{
              label: 'Capacity (MW)',
              data: capacityData.data,
              borderColor: '#1976D2',
              backgroundColor: 'rgba(25, 118, 210, 0.1)',
              tension: 0.4,
              fill: true,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                grid: {
                  color: 'rgba(0, 0, 0, 0.1)'
                }
              },
              x: {
                grid: {
                  display: false
                }
              }
            }
          }
        });
      }

      // Energy distribution chart
      if (distributionChartRef.current) {
        if (distributionChartInstance.current) {
          distributionChartInstance.current.destroy();
        }
        
        const ctx = distributionChartRef.current.getContext('2d');
        distributionChartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: chartData.energyDistribution.map((d: {type: string; percentage: number; color: string}) => d.type),
            datasets: [{
              data: chartData.energyDistribution.map((d: {type: string; percentage: number; color: string}) => d.percentage),
              backgroundColor: chartData.energyDistribution.map((d: {type: string; percentage: number; color: string}) => d.color),
              borderWidth: 2,
              borderColor: '#ffffff'
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  padding: 20,
                  usePointStyle: true
                }
              }
            }
          }
        });
      }
    }

    return () => {
      if (capacityChartInstance.current) {
        capacityChartInstance.current.destroy();
      }
      if (distributionChartInstance.current) {
        distributionChartInstance.current.destroy();
      }
    };
  }, [chartData, capacityTimeRange]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {[1, 2].map((i) => (
          <Card key={i} className="p-6">
            <div className="h-64 flex items-center justify-center">
              <LoadingSpinner />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 flex items-center">
              <TrendingUp className="w-5 h-5 mr-2" />
              Capacity Trends
            </CardTitle>
            <div className="flex items-center space-x-2">
              <Select value={capacityTimeRange} onValueChange={setCapacityTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={handleExcelExport}>
                <Download className="w-4 h-4 mr-1" />
                Export
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas ref={capacityChartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900">
              Energy Types Distribution
            </CardTitle>
            <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4 mr-1" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Energy Distribution Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {chartData.energyDistribution.map((item: {type: string; percentage: number; color: string}, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div 
                            className="w-4 h-4 rounded-full" 
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="font-medium">{item.type}</span>
                        </div>
                        <span className="text-lg font-semibold">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Key Insights:</h4>
                    <ul className="space-y-1 text-sm text-gray-600">
                      <li>• Solar energy leads with the highest capacity share</li>
                      <li>• Wind energy shows strong growth potential</li>
                      <li>• Hydro maintains steady operational efficiency</li>
                      <li>• Diversified portfolio reduces dependency risks</li>
                    </ul>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas ref={distributionChartRef}></canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
