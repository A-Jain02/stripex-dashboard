// src/pages/Signup.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import toast from "react-hot-toast";

import { auth } from "./firebase";
import { createUserIfNotExists } from "./firestoreUtils";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password || !name) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Create Firestore user profile
      await createUserIfNotExists(email, name);

      // ✅ Store session in localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("currentUserEmail", email);
      localStorage.setItem("user", JSON.stringify({ name, email }));

      toast.success("Signup successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error("Signup failed. Email may already be in use.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-lg shadow"
      >
        <h1 className="text-2xl font-bold mb-6 text-center text-indigo-600">Sign Up</h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full mb-4 p-2 rounded border dark:bg-gray-700 dark:text-white"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 p-2 rounded border dark:bg-gray-700 dark:text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 rounded border dark:bg-gray-700 dark:text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
        >
          Create Account
        </button>

        <p className="mt-4 text-sm text-center text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <span
            className="text-indigo-600 hover:underline cursor-pointer"
            onClick={() => navigate("/")}
          >
            Log In
          </span>
        </p>
      </form>
    </div>
  );
}



