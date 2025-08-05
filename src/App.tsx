// src/pages/App.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Search, Trash2, CheckCircle } from "lucide-react";


ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

type Transaction = {
  id: string;
  amount: number;
  status: string;
  date: string;
  description: string;
};

export default function App() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState("Success");

  const email = localStorage.getItem("currentUserEmail");

  useEffect(() => {
    const html = document.documentElement;
    html.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (!email || !users[email]) {
      toast.error("Please log in first.");
      navigate("/");
      return;
    }

    const userTxns = users[email].transactions || [];
    setTransactions(userTxns);
  }, [darkMode, navigate]);

  const filteredTxns = transactions
    .filter((txn) => txn.id.toLowerCase().includes(search.toLowerCase()))
    .filter((txn) => (monthFilter ? txn.date.startsWith(monthFilter) : true));

  const netBalance = transactions.reduce(
    (sum, txn) => (txn.status === "Success" ? sum + txn.amount : sum),
    0
  );

  const currentBalance = transactions.reduce((sum, txn) => sum + txn.amount, 0);

  const chartData = {
    labels: filteredTxns.map((txn) => txn.date),
    datasets: [
      {
        label: "Monthly Payments",
        data: filteredTxns.map((txn) => txn.amount),
        fill: false,
        borderColor: "#6366f1",
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  const handleAddTransaction = () => {
    if (!amount || isNaN(+amount) || !description) {
      toast.error("Please enter valid details");
      return;
    }
    if (!email) {
      toast.error("User email not found.");
      return;
    }
    // Inside your component:
    const newTxn = {
      id: `txn_₹{Date.now()}`,
      amount: parseFloat(amount),
      status,
      date: new Date().toISOString().split("T")[0],
      description,
    };

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (!email) {
      toast.error("User email not found.");
      return;
    }
    const updatedTxns = [...(users[email]?.transactions || []), newTxn];

    users[email].transactions = updatedTxns;
    localStorage.setItem("users", JSON.stringify(users));
    setTransactions(updatedTxns);

    toast.success("Transaction added");
    setAmount("");
    setDescription("");
    setStatus("Success");
  };

  function handleDelete(id: string): void {
    if (!email) {
      toast.error("User email not found.");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const updatedTxns = transactions.filter((txn) => txn.id !== id);
    users[email].transactions = updatedTxns;
    localStorage.setItem("users", JSON.stringify(users));
    setTransactions(updatedTxns);
    toast.success("Transaction deleted");
  }

  function handleUpdateStatus(id: string): void {
    if (!email) {
      toast.error("User email not found.");
      return;
    }
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    const updatedTxns = transactions.map((txn) =>
      txn.id === id ? { ...txn, status: "Success" } : txn
    );
    users[email].transactions = updatedTxns;
    localStorage.setItem("users", JSON.stringify(users));
    setTransactions(updatedTxns);
    toast.success("Status updated to Success");
  }
  
  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Dashboard</h1>
          <button
            onClick={() => {
              const newMode = !darkMode;
              setDarkMode(newMode);
              document.documentElement.classList.toggle("dark", newMode);
            }}
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-3 py-1.5 rounded hover:scale-105 transition"
          >
            {darkMode ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        {/* Summary Cards */}
        <motion.div className="grid gap-6 md:grid-cols-3 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Net Balance</h2>
            <p className="text-2xl font-bold text-green-500 dark:text-green-400">
              ₹{netBalance.toFixed(2)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Current Balance</h2>
            <p className="text-2xl font-bold text-yellow-500 dark:text-yellow-300">
              ₹{currentBalance.toFixed(2)}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-indigo-600 mb-2">Transactions</h2>
            <p className="text-gray-700 dark:text-gray-300">{transactions.length} total</p>
          </div>
        </motion.div>

        {/* Add Transaction */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8 space-y-4">
          <h2 className="text-xl font-bold text-indigo-600 mb-2">Add New Transaction</h2>
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-2 rounded w-full border dark:bg-gray-700"
          />
          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="p-2 rounded w-full border dark:bg-gray-700"
          />
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="p-2 rounded w-full border dark:bg-gray-700"
          >
            <option>Success</option>
            <option>Pending</option>
          </select>
          <button
            onClick={handleAddTransaction}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Add Transaction
          </button>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
          <div className="flex items-center gap-3">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search transactions..."
              className="p-2 rounded border dark:bg-gray-800"
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            onChange={(e) => setMonthFilter(e.target.value)}
            className="p-2 border rounded dark:bg-gray-800"
          >
            <option value="">All Months</option>
            {[...new Set(transactions.map((txn) => txn.date.slice(0, 7)))].map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
        </div>

        {/* Chart */}
        <motion.div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow mb-8">
          <h2 className="text-xl font-semibold text-indigo-600 mb-4">Monthly Payment History</h2>
          <Line data={chartData} options={chartOptions} />
        </motion.div>

        {/* Transactions Table */}
        <motion.div>
          <h2 className="text-2xl font-bold mb-4 text-indigo-600">Recent Transactions</h2>
          <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow">
            <table className="w-full table-auto text-left">
              <thead className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100">
                <tr>
                  <th className="px-6 py-3">Transaction ID</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Description</th>
                </tr>
              </thead>
              <tbody>
                {filteredTxns.map((txn) => (
                  <tr key={txn.id} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="px-6 py-3">{txn.id}</td>
                    <td className="px-6 py-3">₹{txn.amount.toFixed(2)}</td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          txn.status === "Success"
                            ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-200"
                        }`}
                      >
                        {txn.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">{txn.date}</td>
                    <td className="px-6 py-3">{txn.description}</td>
                    <td className="px-6 py-3 flex gap-2">
                      {txn.status === "Pending" && (
                        <button
                          onClick={() => handleUpdateStatus(txn.id)}
                          title="Mark as Success"
                          className="text-green-600 hover:text-green-800"
                        >
                          <CheckCircle size={18} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(txn.id)}
                        title="Delete"
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </main>
    </div>
  );
}


