import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, auth } from "../api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setSuccess(false);
      setLoading(true);

      const res = await api.login({ email, password });
      // backend returns: { token }
      auth.setToken(res.token);

      setSuccess(true);
      navigate("/");
    } catch (e) {
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8">

        <h2
          className="text-3xl font-extrabold text-center mb-6
          bg-gradient-to-r from-blue-600 to-purple-600
          text-transparent bg-clip-text"
        >
          Welcome Back
        </h2>

        {success && (
          <p className="text-green-500 text-center mb-4">
            Login Successful
          </p>
        )}

        {error && (
          <p className="text-red-500 text-center mb-4">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">

          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 rounded-lg border
            border-gray-300 dark:border-gray-700
            bg-transparent dark:text-white
            focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 rounded-lg border
            border-gray-300 dark:border-gray-700
            bg-transparent dark:text-white
            focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full font-semibold text-white
            bg-gradient-to-r from-blue-600 to-purple-600
            hover:opacity-90 transition shadow-lg disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-blue-600 dark:text-blue-400 hover:underline font-semibold"
          >
            Sign Up
          </Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
