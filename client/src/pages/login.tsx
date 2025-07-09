import { useAuthContext } from "@/components/auth/auth-provider";
import { LoginForm } from "@/components/auth/login-form";
import { Redirect } from "wouter";

export default function LoginPage() {
  const { isAuthenticated } = useAuthContext();

  if (isAuthenticated) {
    return <Redirect to="/dashboard" />;
  }

  return <LoginForm />;
}
