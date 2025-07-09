import { TrendingUp, Zap, MapPin, CheckCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useProjectStats } from "@/hooks/use-projects";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export function StatsOverview() {
  const { data: stats, isLoading } = useProjectStats();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6">
            <LoadingSpinner />
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const statCards = [
    {
      title: "Total Projects",
      value: stats.totalProjects.toLocaleString(),
      change: `${stats.percentageChanges.projects}% increase from last month`,
      icon: Zap,
      bgColor: "bg-secondary-100",
      iconColor: "text-secondary-600",
    },
    {
      title: "Total Capacity",
      value: `${stats.totalCapacity.toLocaleString()} MW`,
      change: `${stats.percentageChanges.capacity}% increase from last month`,
      icon: TrendingUp,
      bgColor: "bg-accent-100",
      iconColor: "text-accent-600",
    },
    {
      title: "Active Locations",
      value: stats.activeLocations.toString(),
      change: `${stats.percentageChanges.locations}% increase from last month`,
      icon: MapPin,
      bgColor: "bg-primary-100",
      iconColor: "text-primary-600",
    },
    {
      title: "Operational",
      value: stats.operational.toLocaleString(),
      change: `${stats.percentageChanges.operational}% increase from last month`,
      icon: CheckCircle,
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {statCards.map((stat) => (
        <Card key={stat.title} className="p-6">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`w-8 h-8 ${stat.bgColor} rounded-full flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
                </div>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-500">{stat.title}</div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-sm text-secondary-600">
                <TrendingUp className="w-4 h-4 mr-1" />
                <span>{stat.change}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
