// src/pages/Billing.tsx

import { useEffect, useState } from "react";
import Sidebar from "../Sidebar";
import toast from "react-hot-toast";
import PaymentModal from "../Payment_modal"; // <-- import the modal
import { useNavigate } from "react-router-dom";

export default function Billing() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [selectedPlan, setSelectedPlan] = useState("Free");
  const [showModal, setShowModal] = useState(false);
  const [pendingPlan, setPendingPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const email = localStorage.getItem("currentUserEmail") || "";

  const plans = [
    {
      name: "Free",
      price: "$0",
      description: "Basic features for individuals.",
    },
    {
      name: "Pro",
      price: "$9.99/mo",
      description: "Advanced features for professionals.",
    },
    {
      name: "Enterprise",
      price: "$49.99/mo",
      description: "Best for teams and businesses.",
    },
  ];

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (!email || !users[email]) {
      toast.error("Please log in first.");
      navigate("/");
      return;
    }

    const plan = users[email].plan || "Free";
    setSelectedPlan(plan);
  }, [darkMode, email, navigate]);

  const toggleDarkMode = () => {
    const html = document.documentElement;
    const newMode = !darkMode;
    html.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    setDarkMode(newMode);
  };

  const openModal = (planName: string) => {
    setPendingPlan(planName);
    setShowModal(true);
  };

  const handleSelectPlan = (planName: string) => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    users[email].plan = planName;
    localStorage.setItem("users", JSON.stringify(users));
    setSelectedPlan(planName);
    toast.success(`Plan updated to ${planName}`);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar />

      <main className="flex-1 p-8 relative">
        <div className="absolute right-8 top-8">
          <button
            onClick={toggleDarkMode}
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded hover:scale-105 transition"
          >
            {darkMode ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        <h1 className="text-3xl font-bold mb-8 text-indigo-600">Billing & Plans</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-xl shadow-lg p-6 border transition ${
                selectedPlan === plan.name
                  ? "border-indigo-600 bg-indigo-50 dark:bg-indigo-800 dark:border-indigo-400"
                  : "bg-white dark:bg-gray-800"
              }`}
            >
              <h2 className="text-xl font-bold mb-2">{plan.name}</h2>
              <p className="text-lg text-indigo-600 dark:text-indigo-300 font-semibold mb-3">
                {plan.price}
              </p>
              <p className="mb-4 text-sm">{plan.description}</p>
              {selectedPlan === plan.name ? (
                <span className="px-3 py-1 text-sm rounded bg-green-100 text-green-800 dark:bg-green-700 dark:text-white">
                  Current Plan
                </span>
              ) : (
                <button
                  onClick={() => {
                    if (plan.name === "Pro" || plan.name === "Enterprise") {
                      openModal(plan.name);
                    } else {
                      handleSelectPlan(plan.name);
                    }
                  }}
                  className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                >
                  Choose Plan
                </button>
              )}
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && pendingPlan && (
          <PaymentModal
            plan={pendingPlan}
            onClose={() => setShowModal(false)}
            onSuccess={() => handleSelectPlan(pendingPlan)}
          />
        )}
      </main>
    </div>
  );
}



