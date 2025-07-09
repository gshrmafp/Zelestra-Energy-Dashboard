import { useState } from "react";
import { ChevronUp, ChevronDown, Eye, Edit, Trash2, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useProjects } from "@/hooks/use-projects";
import { useAuthContext } from "@/components/auth/auth-provider";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ProjectForm } from "@/components/projects/project-form";
import { ProjectFilters, Project } from "@shared/schema";
import { ENERGY_TYPES, PROJECT_STATUSES, LOCATIONS, SORT_OPTIONS, ITEMS_PER_PAGE } from "@/lib/constants";

interface ProjectsTableProps {
  searchQuery?: string;
}

export function ProjectsTable({ searchQuery }: ProjectsTableProps) {
  const { isAdmin } = useAuthContext();
  const [filters, setFilters] = useState<ProjectFilters>({
    page: 1,
    limit: ITEMS_PER_PAGE,
    search: searchQuery || "",
  });
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const { projects, total, isLoading, deleteProject, isDeleting } = useProjects(filters);

  const handleFilterChange = (key: keyof ProjectFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value || undefined,
      page: 1, // Reset to first page when filtering
    }));
  };

  const handleSort = (field: string) => {
    const newOrder = filters.sortBy === field && filters.sortOrder === "asc" ? "desc" : "asc";
    setFilters(prev => ({
      ...prev,
      sortBy: field as any,
      sortOrder: newOrder,
    }));
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this project?")) {
      deleteProject(id);
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setIsEditDialogOpen(true);
  };

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false);
    setSelectedProject(null);
  };

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false);
  };

  // Update search when prop changes
  if (searchQuery !== filters.search) {
    setFilters(prev => ({ ...prev, search: searchQuery || "", page: 1 }));
  }

  const getSortIcon = (field: string) => {
    if (filters.sortBy !== field) return <ChevronUp className="w-4 h-4 opacity-0" />;
    return filters.sortOrder === "asc" ? 
      <ChevronUp className="w-4 h-4" /> : 
      <ChevronDown className="w-4 h-4" />;
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: any } = {
      Operational: "default",
      Construction: "secondary",
      Planning: "outline",
      Cancelled: "destructive",
    };
    return <Badge variant={variants[status] || "default"}>{status}</Badge>;
  };

  const getEnergyTypeIcon = (type: string) => {
    const icons: { [key: string]: string } = {
      Solar: "☀️",
      Wind: "💨",
      Hydro: "💧",
      Biomass: "🌿",
      Geothermal: "🌋",
    };
    return icons[type] || "⚡";
  };

  const totalPages = Math.ceil(total / ITEMS_PER_PAGE);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900 mb-4 md:mb-0">
            Renewable Energy Projects
          </CardTitle>
          
          {isAdmin && (
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-primary-500 hover:bg-primary-600">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <ProjectForm onSuccess={handleCreateSuccess} />
              </DialogContent>
            </Dialog>
          )}
          
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <Select value={filters.energyType || "all"} onValueChange={(value) => handleFilterChange("energyType", value === "all" ? "" : value)}>
              <SelectTrigger className="w-full md:w-auto">
                <SelectValue placeholder="All Energy Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Energy Types</SelectItem>
                {ENERGY_TYPES.map(type => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.status || "all"} onValueChange={(value) => handleFilterChange("status", value === "all" ? "" : value)}>
              <SelectTrigger className="w-full md:w-auto">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                {PROJECT_STATUSES.map(status => (
                  <SelectItem key={status.value} value={status.value}>
                    {status.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={filters.location || "all"} onValueChange={(value) => handleFilterChange("location", value === "all" ? "" : value)}>
              <SelectTrigger className="w-full md:w-auto">
                <SelectValue placeholder="All Locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {LOCATIONS.map(location => (
                  <SelectItem key={location.value} value={location.value}>
                    {location.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700"
                    onClick={() => handleSort("name")}
                  >
                    <span>Project Name</span>
                    {getSortIcon("name")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700"
                    onClick={() => handleSort("energyType")}
                  >
                    <span>Energy Type</span>
                    {getSortIcon("energyType")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700"
                    onClick={() => handleSort("capacity")}
                  >
                    <span>Capacity (MW)</span>
                    {getSortIcon("capacity")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 hover:text-gray-700"
                    onClick={() => handleSort("year")}
                  >
                    <span>Year</span>
                    {getSortIcon("year")}
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <LoadingSpinner />
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No projects found
                  </td>
                </tr>
              ) : (
                projects.map((project) => (
                  <tr key={project.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-8 w-8">
                          <div className="h-8 w-8 rounded-full bg-accent-100 flex items-center justify-center">
                            <span className="text-sm">{getEnergyTypeIcon(project.energyType)}</span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{project.name}</div>
                          <div className="text-sm text-gray-500">{project.owner}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant="secondary">{project.energyType}</Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {parseFloat(project.capacity).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.location}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(project.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {project.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                      {isAdmin && (
                        <>
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(project)}>
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleDelete(project.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="w-4 h-4 text-red-600" />
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <div className="flex-1 flex justify-between sm:hidden">
            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.max(1, filters.page! - 1))}
              disabled={filters.page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => handlePageChange(Math.min(totalPages, filters.page! + 1))}
              disabled={filters.page === totalPages}
            >
              Next
            </Button>
          </div>
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Showing{" "}
                <span className="font-medium">
                  {((filters.page! - 1) * ITEMS_PER_PAGE) + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium">
                  {Math.min(filters.page! * ITEMS_PER_PAGE, total)}
                </span>{" "}
                of{" "}
                <span className="font-medium">{total}</span> results
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.max(1, filters.page! - 1))}
                  disabled={filters.page === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={filters.page === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(Math.min(totalPages, filters.page! + 1))}
                  disabled={filters.page === totalPages}
                >
                  Next
                </Button>
              </nav>
            </div>
          </div>
        </div>
      </CardContent>
      
      {/* Edit Dialog */}
      {selectedProject && (
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Edit Project</DialogTitle>
            </DialogHeader>
            <ProjectForm 
              project={selectedProject} 
              onSuccess={handleEditSuccess} 
            />
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
