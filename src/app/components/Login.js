"use client";

import { useState } from "react";
import { useAuth } from "../utils/context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user, login, logout } = useAuth();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (error) {
      setError("Failed to log in. Please check your credentials.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white">
      <h1 className="pb-12 text-4xl text-transparent bg-gradient-to-r from-green-400 via-orange-500 to-orange-500 bg-clip-text">
        Build My Documents.
      </h1>{" "}
      <div className="p-8 transition-transform transform bg-gray-800 rounded-lg shadow-lg w-96 hover:scale-105">
        <h1 className="mb-6 text-2xl font-normal text-center text-gray-300">
          {user ? "Logout" : "Login"}
        </h1>
        {error && <p className="mb-4 text-red-500">{error}</p>}

        {/* Show user email if authenticated */}
        {user && (
          <p className="mb-4 text-center">
            <span className="font-semibold">{user.email}</span>
          </p>
        )}

        {/* Show login form if user is not authenticated */}
        {!user ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="block w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="block w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:border-indigo-500"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 text-white transition bg-gradient-to-r from-green-400 via-orange-500 to-orange-500 hover:bg-indigo-700 focus:outline-none"
            >
              Login
            </button>
          </form>
        ) : (
          // Show logout button if user is authenticated
          <div className="text-center">
            <button
              onClick={logout}
              className="w-full p-3 mt-4 text-white transition bg-gradient-to-r from-green-400 via-orange-500 to-orange-500 hover:bg-red-700 focus:outline-none"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
