import { Outlet } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { Target, Shield, TrendingDown, Settings } from "lucide-react";
//import { useState } from "react";

export default function MainLayout() {
  //const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1a1d29] text-white flex flex-col fixed h-full z-10 ">
        
        {/* Logo */}
        <div className="p-6 flex items-center gap-3 ">
          <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">FI</span>
          </div>
          <span className="font-semibold text-lg">Financial Intelligence</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1 ">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3 ">
            General
          </div>
          
          <NavLink
            to="."
            end
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`
            }
          >
            <Target className="w-5 h-5" />
            <span className="text-sm font-medium">Goals & Strategy</span>
          </NavLink>

          <NavLink
            to="DebtsAdvice"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`
            }
          >
            <TrendingDown className="w-5 h-5" />
            <span className="text-sm font-medium">Debt Optimization</span>
          </NavLink>

          <NavLink
            to="InsuranceAdvice"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`
            }
          >
            <Shield className="w-5 h-5" />
            <span className="text-sm font-medium">Protection & Insurance</span>
          </NavLink>
        </nav>

        {/* Settings*/}
        <div className="border-t border-gray-800 p-4 space-y-1">
          <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            Account
          </div>
          
          <NavLink
            to="SettingsPage"
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white hover:bg-gray-800/50"
              }`
            }
          >
            <Settings className="w-5 h-5" />
            <span className="text-sm font-medium">Settings</span>
          </NavLink>
        </div>

      </aside>
      
      {/* Main Content */}
      <main className="flex-1 ml-64">
        <Outlet />{/** Child components are injected here.*/}
      </main>
    </div>
  );
}
