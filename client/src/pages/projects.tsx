import { useState } from "react";
import { Plus, Download } from "lucide-react";
import { NavigationHeader } from "@/components/dashboard/navigation-header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { ProjectsTable } from "@/components/dashboard/projects-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ProjectForm } from "@/components/projects/project-form";
import { useAuthContext } from "@/components/auth/auth-provider";
import { getAuthHeaders } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";

export default function ProjectsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { isAdmin } = useAuthContext();
  const { toast } = useToast();

  const handleExport = async () => {
    try {
      const response = await fetch('/api/projects/export', {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error('Export failed');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'renewable_energy_projects.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export successful",
        description: "Projects exported to CSV file",
      });
    } catch (error) {
      toast({
        title: "Export failed",
        description: "Failed to export projects",
        variant: "destructive",
      });
    }
  };

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
                <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
                <p className="text-gray-600 mt-1">Manage renewable energy projects</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                {isAdmin && (
                  <Button variant="outline" onClick={handleExport}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Projects
                  </Button>
                )}
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
                      <ProjectForm onSuccess={() => setIsCreateDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                )}
              </div>
            </div>

            {/* Projects Table */}
            <ProjectsTable searchQuery={searchQuery} />
          </div>
        </main>
      </div>
    </div>
  );
}