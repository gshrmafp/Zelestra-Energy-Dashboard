import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useChartData } from "@/hooks/use-projects";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Import Chart.js
declare const Chart: any;

export function ChartsSection() {
  const { data: chartData, isLoading } = useChartData();
  const capacityChartRef = useRef<HTMLCanvasElement>(null);
  const distributionChartRef = useRef<HTMLCanvasElement>(null);
  const capacityChartInstance = useRef<any>(null);
  const distributionChartInstance = useRef<any>(null);

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
      // Capacity trends chart
      if (capacityChartRef.current) {
        if (capacityChartInstance.current) {
          capacityChartInstance.current.destroy();
        }
        
        const ctx = capacityChartRef.current.getContext('2d');
        capacityChartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: chartData.capacityTrends.map(d => d.month),
            datasets: [{
              label: 'Capacity (MW)',
              data: chartData.capacityTrends.map(d => d.capacity),
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
            labels: chartData.energyDistribution.map(d => d.type),
            datasets: [{
              data: chartData.energyDistribution.map(d => d.percentage),
              backgroundColor: chartData.energyDistribution.map(d => d.color),
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
  }, [chartData]);

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
            <CardTitle className="text-lg font-semibold text-gray-900">
              Capacity Trends
            </CardTitle>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                className="text-sm px-3 py-1 bg-primary-100 text-primary-700 border-primary-200"
              >
                Monthly
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                className="text-sm px-3 py-1 text-gray-600 hover:bg-gray-100"
              >
                Yearly
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
            <Button variant="ghost" size="sm" className="text-sm text-primary-500 hover:text-primary-600">
              View Details
            </Button>
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
