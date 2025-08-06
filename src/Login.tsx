// src/pages/Login.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

import { auth } from "./firebase";
import { getUserProfile } from "./firestoreUtils";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 🔄 Fetch user profile from Firestore
      const userProfile = await getUserProfile(email);
      if (!userProfile) {
        toast.error("User profile not found.");
        return;
      }

      // ✅ Set session
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUserEmail", email);
      localStorage.setItem("user", JSON.stringify(userProfile));

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Login error:", error);
      toast.error("Invalid credentials. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded shadow"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600">Log In</h1>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 rounded border dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-3 p-2 rounded border dark:bg-gray-700 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Log In
        </button>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Don’t have an account?{" "}
          <span
            className="text-indigo-600 hover:underline cursor-pointer"
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </form>
    </div>
  );
}
