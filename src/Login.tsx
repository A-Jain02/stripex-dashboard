// src/pages/Login.tsx
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";
import { useNavigate } from "react-router-dom";
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

      // Save session to localStorage
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("user", JSON.stringify({ email: user.email, name: user.displayName }));

      toast.success("Login successful!");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Invalid credentials or user not found.");
      console.error(error);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
  
      const userInfo = {
        email: user.email,
        name: user.displayName,
      };
  
      // Save user session
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("user", JSON.stringify(userInfo));
      localStorage.setItem("users", JSON.stringify({ [user.email]: userInfo }));
  
      toast.success("Logged in with Google!");
      navigate("/dashboard"); // Redirect after saving session
    } catch (error) {
      toast.error("Google login failed.");
      console.error(error);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-gray-50 dark:bg-gray-900">
      <form onSubmit={handleLogin} className="w-full max-w-md p-6 bg-white dark:bg-gray-800 rounded shadow">
        <h1 className="text-2xl font-bold mb-4 text-center text-indigo-600">Login</h1>

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
          Log In
        </button>

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="mt-4 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition"
        >
          Sign in with Google
        </button>
      </form>
    </div>
  );
}

