import { useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useChartData } from "@/hooks/use-projects";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

// Import Chart.js
declare const Chart: any;

interface AnalyticsChartsProps {
  timeRange: string;
}

export function AnalyticsCharts({ timeRange }: AnalyticsChartsProps) {
  const { data: chartData, isLoading } = useChartData();
  const performanceChartRef = useRef<HTMLCanvasElement>(null);
  const locationChartRef = useRef<HTMLCanvasElement>(null);
  const statusChartRef = useRef<HTMLCanvasElement>(null);
  const performanceChartInstance = useRef<any>(null);
  const locationChartInstance = useRef<any>(null);
  const statusChartInstance = useRef<any>(null);

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
      // Performance Over Time Chart
      if (performanceChartRef.current) {
        if (performanceChartInstance.current) {
          performanceChartInstance.current.destroy();
        }
        
        const ctx = performanceChartRef.current.getContext('2d');
        performanceChartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4'],
            datasets: [{
              label: 'Projects Added',
              data: [12, 19, 8, 15],
              backgroundColor: 'rgba(25, 118, 210, 0.8)',
              borderColor: '#1976D2',
              borderWidth: 1
            }, {
              label: 'Projects Completed',
              data: [8, 15, 6, 12],
              backgroundColor: 'rgba(76, 175, 80, 0.8)',
              borderColor: '#4CAF50',
              borderWidth: 1
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true
              }
            }
          }
        });
      }

      // Location Distribution Chart
      if (locationChartRef.current) {
        if (locationChartInstance.current) {
          locationChartInstance.current.destroy();
        }
        
        const ctx = locationChartRef.current.getContext('2d');
        locationChartInstance.current = new Chart(ctx, {
          type: 'polarArea',
          data: {
            labels: ['California', 'Texas', 'Florida', 'New York', 'Oregon'],
            datasets: [{
              data: [30, 25, 20, 15, 10],
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'right'
              }
            }
          }
        });
      }

      // Status Distribution Chart
      if (statusChartRef.current) {
        if (statusChartInstance.current) {
          statusChartInstance.current.destroy();
        }
        
        const ctx = statusChartRef.current.getContext('2d');
        statusChartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['Operational', 'Construction', 'Planning', 'Cancelled'],
            datasets: [{
              data: [60, 25, 12, 3],
              backgroundColor: [
                '#4CAF50',
                '#FF9800',
                '#2196F3',
                '#F44336'
              ]
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom'
              }
            }
          }
        });
      }
    }

    return () => {
      if (performanceChartInstance.current) {
        performanceChartInstance.current.destroy();
      }
      if (locationChartInstance.current) {
        locationChartInstance.current.destroy();
      }
      if (statusChartInstance.current) {
        statusChartInstance.current.destroy();
      }
    };
  }, [chartData, timeRange]);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
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
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Performance Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas ref={performanceChartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Location Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas ref={locationChartRef}></canvas>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Status Distribution
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <canvas ref={statusChartRef}></canvas>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}