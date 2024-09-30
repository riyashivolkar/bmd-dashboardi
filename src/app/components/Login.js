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
    <div className="flex flex-col items-center justify-center h-screen text-black">
      {/* <h1 class="text-4xl text-center mb-12 font-thin   traack  text-white">
        Build My Documents.
      </h1> */}
      <div className="p-8 bg-white rounded-lg shadow-2xl w-96">
        <h1 className="mb-6 text-2xl text-center">Login</h1>
        {error && <p className="text-red-500">{error}</p>}

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
                className="block w-full p-3 border border-gray-300 rounded"
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
                className="block w-full p-3 border border-gray-300 rounded"
              />
            </div>
            <button
              type="submit"
              className="w-full p-3 text-white transition bg-indigo-600 rounded hover:bg-indigo-700"
            >
              Login
            </button>
          </form>
        ) : (
          // Show logout button if user is authenticated
          <div className="text-center">
            <p>Welcome, {user.email}!</p>
            <button
              onClick={logout}
              className="p-3 mt-4 text-white transition bg-red-600 rounded hover:bg-red-700"
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
