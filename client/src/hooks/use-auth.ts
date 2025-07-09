import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthUser, LoginCredentials } from "@shared/schema";
import { authStorage, getAuthHeaders } from "@/lib/auth";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Check if user is authenticated on mount
  useEffect(() => {
    const token = authStorage.getToken();
    const storedUser = authStorage.getUser();
    
    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const response = await apiRequest("POST", "/api/auth/login", credentials);
      return response.json();
    },
    onSuccess: (data) => {
      const { user, token } = data;
      authStorage.setToken(token);
      authStorage.setUser(user);
      setIsAuthenticated(true);
      setUser(user);
      toast({
        title: "Welcome back!",
        description: `Logged in as ${user.name}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials",
        variant: "destructive",
      });
    },
  });

  const verifyTokenQuery = useQuery({
    queryKey: ["/api/auth/verify"],
    queryFn: async () => {
      const token = authStorage.getToken();
      if (!token) return null;
      
      const response = await fetch("/api/auth/verify", {
        headers: getAuthHeaders(),
      });
      
      if (!response.ok) {
        throw new Error("Token verification failed");
      }
      
      return response.json();
    },
    enabled: !!authStorage.getToken(),
    retry: false,
  });

  const logout = () => {
    authStorage.clear();
    setIsAuthenticated(false);
    setUser(null);
    queryClient.clear();
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    });
  };

  return {
    isAuthenticated,
    user,
    login: loginMutation.mutate,
    loginLoading: loginMutation.isPending,
    logout,
    isAdmin: user?.role === "admin",
  };
}
