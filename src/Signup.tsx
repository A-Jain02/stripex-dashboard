// src/pages/Signup.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Signup() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = () => {
    if (!name || !email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    const users = JSON.parse(localStorage.getItem("users") || "{}");

    if (users[email]) {
      toast.error("Email already registered. Please login.");
      return;
    }

    const newUser = {
      name,
      email,
      password,
      transactions: [],
      profile: {
        name,
        email,
        avatar: "",
      },
    };

    users[email] = newUser;
    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUserEmail", email);

    toast.success("Signup successful!");
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-indigo-600 text-center">Create an Account</h2>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 border rounded dark:bg-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-6 border rounded dark:bg-gray-700 dark:text-white"
        />
        <button
          onClick={handleSignup}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded transition"
        >
          Sign Up
        </button>
        <p className="text-center mt-4 text-sm text-gray-500">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/")}
            className="text-indigo-600 cursor-pointer"
          >
            Log In
          </span>
        </p>
      </div>
    </div>
  );
}


