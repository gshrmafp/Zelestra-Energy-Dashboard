import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InsertUser, insertUserSchema } from "@shared/schema";
import { useUsers } from "@/hooks/use-users";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface UserFormProps {
  user?: InsertUser & { id?: number };
  onSuccess: () => void;
}

export function UserForm({ user, onSuccess }: UserFormProps) {
  const { createUser, updateUser, isCreating, isUpdating } = useUsers();
  const isEditing = !!user?.id;

  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      password: "",
      role: user?.role || "user",
    },
  });

  const onSubmit = (data: InsertUser) => {
    if (isEditing && user?.id) {
      updateUser({ id: user.id, data });
    } else {
      createUser(data);
    }
    onSuccess();
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          {...form.register("name")}
          placeholder="Enter full name"
        />
        {form.formState.errors.name && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.name.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...form.register("email")}
          placeholder="Enter email address"
        />
        {form.formState.errors.email && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          {...form.register("password")}
          placeholder={isEditing ? "Leave blank to keep current password" : "Enter password"}
        />
        {form.formState.errors.password && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div>
        <Label htmlFor="role">Role</Label>
        <Select 
          value={form.watch("role")} 
          onValueChange={(value) => form.setValue("role", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
          </SelectContent>
        </Select>
        {form.formState.errors.role && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.role.message}
          </p>
        )}
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
            isEditing ? "Update User" : "Create User"
          )}
        </Button>
      </div>
    </form>
  );
}