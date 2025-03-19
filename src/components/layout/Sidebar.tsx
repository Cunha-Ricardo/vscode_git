
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { BarChart3, Settings, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Configurações",
      path: "/settings",
      icon: <Settings className="h-5 w-5" />,
    },
  ];

  return (
    <div className="h-screen bg-white border-r border-gray-200 w-64 flex flex-col">
      <div className="p-6">
        <div className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center">
            <svg viewBox="0 0 64 64" className="h-8 w-8">
              <circle cx="32" cy="32" r="32" className="fill-brand-purple" />
              <circle cx="20" cy="32" r="12" className="fill-brand-blue" />
              <circle cx="38" cy="32" r="12" className="fill-white" opacity="0.8" />
            </svg>
          </div>
          <span className="text-xl font-bold uppercase tracking-wider">Painel de Dados</span>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center space-x-3 px-4 py-3 rounded-md transition-colors",
              location.pathname === item.path
                ? "bg-primary text-white"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            {item.icon}
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center space-x-3 text-gray-600 hover:text-gray-900 px-4 py-3 w-full transition-colors"
        >
          <LogOut className="h-5 w-5" />
          <span>Sair</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
