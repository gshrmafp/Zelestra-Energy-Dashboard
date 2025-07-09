import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, 
  Folder, 
  BarChart3, 
  MapPin, 
  Users, 
  Settings 
} from "lucide-react";
import { useAuthContext } from "@/components/auth/auth-provider";

export function Sidebar() {
  const [location] = useLocation();
  const { isAdmin } = useAuthContext();

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Projects", href: "/projects", icon: Folder },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Locations", href: "/locations", icon: MapPin },
  ];

  const adminNavigation = [
    { name: "Users", href: "/users", icon: Users },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  const isActive = (href: string) => location === href;

  return (
    <div className="w-64 bg-white shadow-sm h-screen sticky top-0">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <img 
            src="/attached_assets/image_1752044667179.png" 
            alt="Zelestra Energy" 
            className="h-8 w-8"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-900">Zelestra Energy</h1>
            <p className="text-xs text-gray-500">Renewable Energy Platform</p>
          </div>
        </div>
      </div>
      
      <nav className="mt-8">
        <div className="px-6 mb-8">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Navigation
          </h2>
        </div>
        <ul className="space-y-2 px-4">
          {navigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive(item.href)
                    ? "text-primary-700 bg-primary-50 border-r-2 border-primary-500 font-medium"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-primary-500" : ""}`} />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        {isAdmin && (
          <>
            <div className="px-6 py-4 mt-6 mb-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Administration
              </h3>
            </div>
            <ul className="space-y-2 px-4">
              {adminNavigation.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? "text-primary-700 bg-primary-50 border-r-2 border-primary-500 font-medium"
                        : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon className={`w-5 h-5 ${isActive(item.href) ? "text-primary-500" : ""}`} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </nav>
    </div>
  );
}
