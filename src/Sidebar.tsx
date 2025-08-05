// src/components/Sidebar.tsx

import { useNavigate } from "react-router-dom";
import { Home, CreditCard, Settings, LogOut } from "lucide-react";

export default function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("currentUserEmail");
    navigate("/");
  };

  const links = [
    { name: "Dashboard", icon: <Home size={18} /> },
    { name: "Billing", icon: <CreditCard size={18} /> },
    { name: "Settings", icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-gray-900 p-6 space-y-8 shadow-lg">
      <h2 className="text-2xl font-bold text-indigo-600">StripeX</h2>
      <nav className="space-y-4">
        {links.map((link) => (
          <div
            key={link.name}
            onClick={() => navigate(`/${link.name.toLowerCase()}`)}
            className="flex items-center gap-3 text-gray-700 dark:text-gray-200 hover:bg-indigo-100 dark:hover:bg-indigo-800 px-4 py-2 rounded cursor-pointer transition"
          >
            {link.icon}
            <span>{link.name}</span>
          </div>
        ))}
      </nav>
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 w-full"
        >
          <LogOut size={18} /> Logout
        </button>
      </div>
    </aside>
  );
}
