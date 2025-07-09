import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/use-projects";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MapPin, Zap } from "lucide-react";

interface LocationsMapProps {
  searchQuery: string;
}

export function LocationsMap({ searchQuery }: LocationsMapProps) {
  const { projects, isLoading } = useProjects({ search: searchQuery });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-96 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  // Group projects by location
  const locationGroups = projects.reduce((acc: any, project) => {
    const location = project.location;
    if (!acc[location]) {
      acc[location] = [];
    }
    acc[location].push(project);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Project Locations Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Interactive Map</h3>
              <p className="text-gray-600">Map visualization would be integrated here using a service like Google Maps or Mapbox</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(locationGroups).map(([location, locationProjects]: [string, any]) => {
          const totalCapacity = locationProjects.reduce((sum: number, project: any) => 
            sum + parseFloat(project.capacity), 0
          );
          const operationalCount = locationProjects.filter((p: any) => p.status === 'Operational').length;

          return (
            <Card key={location}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {location}
                  </CardTitle>
                  <Badge variant="secondary">
                    {locationProjects.length} projects
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Total Capacity</span>
                    <span className="font-medium">{totalCapacity.toFixed(1)} MW</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Operational</span>
                    <span className="font-medium">{operationalCount}</span>
                  </div>
                  <div className="space-y-2">
                    {locationProjects.slice(0, 3).map((project: any) => (
                      <div key={project.id} className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-primary-500" />
                        <span className="text-sm text-gray-700 truncate">{project.name}</span>
                      </div>
                    ))}
                    {locationProjects.length > 3 && (
                      <div className="text-sm text-gray-500">
                        +{locationProjects.length - 3} more projects
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}