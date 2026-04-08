import { Link, useLocation } from "react-router";
import { Button } from "../ui/button";
import { Activity, Home, BarChart3, Layers, GitCompare, FileText } from "lucide-react";

export function DashboardNav() {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Input", icon: Home },
    { path: "/results", label: "Results", icon: BarChart3 },
    { path: "/visualization", label: "Visualization", icon: Layers },
    { path: "/comparison", label: "Compare", icon: GitCompare },
    { path: "/report", label: "Report", icon: FileText },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-[1440px] mx-auto px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/#top" className="flex items-center">
            <span className="text-lg text-[#0A2540]">Thermal Analysis</span>
          </Link>

          {/* Dashboard Navigation */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className={isActive ? "bg-[#3A86FF] text-white" : "text-[#0A2540] hover:bg-gray-100"}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {item.label}
                  </Button>
                </Link>
              );
            })}
          </div>

        </div>
      </div>
    </nav>
  );
}
