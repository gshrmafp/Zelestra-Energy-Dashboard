import { useState } from "react";
import { Plus } from "lucide-react";
import { NavigationHeader } from "@/components/dashboard/navigation-header";
import { Sidebar } from "@/components/dashboard/sidebar";
import { UsersTable } from "@/components/users/users-table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { UserForm } from "@/components/users/user-form";
import { useAuthContext } from "@/components/auth/auth-provider";
import { Redirect } from "wouter";

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { isAdmin } = useAuthContext();

  if (!isAdmin) {
    return <Redirect to="/dashboard" />;
  }

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
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Button variant="outline">
                  Export Users
                </Button>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="bg-primary-500 hover:bg-primary-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Add User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Create New User</DialogTitle>
                    </DialogHeader>
                    <UserForm onSuccess={() => setIsCreateDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Users Table */}
            <UsersTable searchQuery={searchQuery} />
          </div>
        </main>
      </div>
    </div>
  );
}