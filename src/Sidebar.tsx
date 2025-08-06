// src/pages/Sidebar.tsx

import { Home, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  const navLinks = [
    { name: "Dashboard", icon: <Home size={18} />, path: "/dashboard" },
    { name: "Settings", icon: <Settings size={18} />, path: "/settings" },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 p-6 space-y-8 shadow-lg">
      <h2
        className="text-2xl font-bold text-indigo-600 cursor-pointer"
        onClick={() => navigate("/dashboard")}
      >
        StripeX
      </h2>
      <nav className="space-y-4">
        {navLinks.map((link) => (
          <div
            key={link.name}
            onClick={() => navigate(link.path)}
            className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-800 px-4 py-2 rounded cursor-pointer transition"
          >
            {link.icon}
            <span>{link.name}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
}

