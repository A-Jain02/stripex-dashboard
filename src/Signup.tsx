// src/pages/Signup.tsx
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userInfo = {
        email: user.email,
        name: user.displayName || "",
        transactions: [],
        profile: {
          name: "",
          picture: "",
        },
      };

      // Save to localStorage
      const users = JSON.parse(localStorage.getItem("users") || "{}");
      if (!users[email]) {
        users[email] = userInfo;
        localStorage.setItem("users", JSON.stringify(users));
      }

      // Store session
      localStorage.setItem("currentUserEmail", email);
      localStorage.setItem("loggedIn", "true");

      toast.success("Signup successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Signup failed. Email may already be in use.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded shadow"
      >
        <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600">Sign Up</h1>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 rounded border dark:bg-gray-700 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 rounded border dark:bg-gray-700 dark:text-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}



