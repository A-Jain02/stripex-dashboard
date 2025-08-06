import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Get existing users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "{}");

      if (users[email]) {
        toast.error("User already exists.");
        return;
      }

      // Add new user with initial empty transaction list
      users[email] = {
        email,
        name,
        transactions: [],
        profile: {
          name,
          picture: "",
        },
      };

      // Store new user and session
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUserEmail", email);
      localStorage.setItem("loggedIn", "true");

      toast.success("Signup successful!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error(error);
      toast.error("Signup failed. Try a different email or stronger password.");
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
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-3 p-2 rounded border dark:bg-gray-700 dark:text-white"
          required
        />
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 rounded border dark:bg-gray-700 dark:text-white"
          required
        />
        <input
          type="password"
          placeholder="Create Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 p-2 rounded border dark:bg-gray-700 dark:text-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Create Account
        </button>
      </form>
    </div>
  );
}



