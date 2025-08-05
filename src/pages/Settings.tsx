// src/pages/Settings.tsx

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Sidebar from "../Sidebar";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [name, setName] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("currentUserEmail") || "");
  const [profilePic, setProfilePic] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);

    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (email && users[email]) {
      const user = users[email];
      setName(user.name || "");
      setProfilePic(user.profilePic || "");
    }
  }, [email, darkMode]);

  const handleSave = () => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (email && users[email]) {
      users[email].name = name;
      users[email].profilePic = profilePic;
      localStorage.setItem("users", JSON.stringify(users));
      toast.success("Profile updated");
    }
  };

  const handlePasswordUpdate = () => {
    const users = JSON.parse(localStorage.getItem("users") || "{}");
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (users[email]?.password !== oldPassword) {
      toast.error("Old password is incorrect");
      return;
    }

    users[email].password = newPassword;
    localStorage.setItem("users", JSON.stringify(users));
    toast.success("Password updated successfully");
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleDarkModeToggle = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Sidebar />

      <main className="flex-1 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-600">Settings</h1>
          <button
            onClick={handleDarkModeToggle}
            className="bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded hover:scale-105 transition"
          >
            {darkMode ? "🌙 Dark" : "☀️ Light"}
          </button>
        </div>

        {/* Profile Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-10">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">Profile Information</h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700"
            />
            <input
              type="email"
              disabled
              value={email}
              className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700"
            />
            <input
              type="text"
              placeholder="Profile Picture URL"
              value={profilePic}
              onChange={(e) => setProfilePic(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700"
            />
            {profilePic && (
              <img
                src={profilePic}
                alt="Preview"
                className="h-20 w-20 rounded-full border object-cover"
              />
            )}
            <button
              onClick={handleSave}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>

        {/* Password Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-indigo-600">Change Password</h2>
          <div className="space-y-4">
            <input
              type="password"
              placeholder="Old Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700"
            />
            <input
              type="password"
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full p-2 border rounded dark:bg-gray-700"
            />
            <button
              onClick={handlePasswordUpdate}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
            >
              Update Password
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

