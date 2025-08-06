import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem("users") || "{}");
      if (!users[email]) {
        toast.error("User not found in localStorage.");
        return;
      }

      // Store session info
      localStorage.setItem("currentUserEmail", email);
      localStorage.setItem("loggedIn", "true");

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Invalid credentials or user not found.");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleLogin} className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600">Log In</h1>

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
          className="w-full mb-4 p-2 rounded border dark:bg-gray-700 dark:text-white"
          required
        />
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition"
        >
          Log In
        </button>

        <p className="mt-4 text-center text-gray-600 dark:text-gray-300">
          New here?{" "}
          <Link to="/signup" className="text-indigo-600 hover:underline">
            Create an Account
          </Link>
        </p>
      </form>
    </div>
  );
}
