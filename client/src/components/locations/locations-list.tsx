import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useProjects } from "@/hooks/use-projects";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { MapPin, Zap, Users } from "lucide-react";

interface LocationsListProps {
  searchQuery: string;
}

export function LocationsList({ searchQuery }: LocationsListProps) {
  const { projects, isLoading } = useProjects({ search: searchQuery });

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="h-64 flex items-center justify-center">
          <LoadingSpinner />
        </div>
      </Card>
    );
  }

  // Group projects by location and calculate stats
  const locationStats = projects.reduce((acc: any, project) => {
    const location = project.location;
    if (!acc[location]) {
      acc[location] = {
        location,
        projects: [],
        totalCapacity: 0,
        operationalCount: 0,
        energyTypes: new Set(),
      };
    }
    
    acc[location].projects.push(project);
    acc[location].totalCapacity += parseFloat(project.capacity);
    acc[location].energyTypes.add(project.energyType);
    
    if (project.status === 'Operational') {
      acc[location].operationalCount++;
    }
    
    return acc;
  }, {});

  const locations = Object.values(locationStats).sort((a: any, b: any) => 
    b.totalCapacity - a.totalCapacity
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">
          Locations Overview
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total Capacity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operational
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Energy Types
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locations.map((location: any) => (
                <tr key={location.location} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 text-primary-500 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {location.location}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-900">
                        {location.projects.length}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {location.totalCapacity.toFixed(1)} MW
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Users className="w-4 h-4 text-green-500 mr-1" />
                      <span className="text-sm text-gray-900">
                        {location.operationalCount}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {Array.from(location.energyTypes).map((type: string) => (
                        <Badge key={type} variant="secondary" className="text-xs">
                          {type}
                        </Badge>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}