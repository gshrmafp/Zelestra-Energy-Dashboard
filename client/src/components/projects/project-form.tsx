import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InsertProject, insertProjectSchema } from "@shared/schema";
import { useProjects } from "@/hooks/use-projects";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { ENERGY_TYPES, PROJECT_STATUSES } from "@/lib/constants";

interface ProjectFormProps {
  project?: InsertProject & { id?: number };
  onSuccess: () => void;
}

export function ProjectForm({ project, onSuccess }: ProjectFormProps) {
  const { createProject, updateProject, isCreating, isUpdating } = useProjects();
  const isEditing = !!project?.id;

  const form = useForm<InsertProject>({
    resolver: zodResolver(insertProjectSchema),
    defaultValues: {
      name: project?.name || "",
      owner: project?.owner || "",
      energyType: project?.energyType || "",
      capacity: project?.capacity || "",
      location: project?.location || "",
      status: project?.status || "",
      year: project?.year || new Date().getFullYear(),
      latitude: project?.latitude || "",
      longitude: project?.longitude || "",
    },
  });

  const onSubmit = (data: InsertProject) => {
    if (isEditing && project?.id) {
      updateProject({ id: project.id, data });
    } else {
      createProject(data);
    }
    onSuccess();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Project Name</Label>
          <Input
            id="name"
            {...form.register("name")}
            placeholder="Enter project name"
          />
          {form.formState.errors.name && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="owner">Owner</Label>
          <Input
            id="owner"
            {...form.register("owner")}
            placeholder="Enter owner name"
          />
          {form.formState.errors.owner && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.owner.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="energyType">Energy Type</Label>
          <Select 
            value={form.watch("energyType")} 
            onValueChange={(value) => form.setValue("energyType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select energy type" />
            </SelectTrigger>
            <SelectContent>
              {ENERGY_TYPES.map(type => (
                <SelectItem key={type.value} value={type.label}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.energyType && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.energyType.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="capacity">Capacity (MW)</Label>
          <Input
            id="capacity"
            {...form.register("capacity")}
            placeholder="Enter capacity"
            type="number"
            step="0.1"
          />
          {form.formState.errors.capacity && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.capacity.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            {...form.register("location")}
            placeholder="Enter location"
          />
          {form.formState.errors.location && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.location.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select 
            value={form.watch("status")} 
            onValueChange={(value) => form.setValue("status", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_STATUSES.map(status => (
                <SelectItem key={status.value} value={status.label}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.status && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.status.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="year">Year</Label>
          <Input
            id="year"
            {...form.register("year", { valueAsNumber: true })}
            placeholder="Enter year"
            type="number"
            min="2000"
            max="2030"
          />
          {form.formState.errors.year && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.year.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="latitude">Latitude (Optional)</Label>
          <Input
            id="latitude"
            {...form.register("latitude")}
            placeholder="Enter latitude"
            type="number"
            step="0.000001"
          />
        </div>

        <div>
          <Label htmlFor="longitude">Longitude (Optional)</Label>
          <Input
            id="longitude"
            {...form.register("longitude")}
            placeholder="Enter longitude"
            type="number"
            step="0.000001"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isCreating || isUpdating}
          className="bg-primary-500 hover:bg-primary-600"
        >
          {(isCreating || isUpdating) ? (
            <LoadingSpinner size="sm" />
          ) : (
            isEditing ? "Update Project" : "Create Project"
          )}
        </Button>
      </div>
    </form>
  );
}