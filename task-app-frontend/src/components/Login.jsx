import React, { useState } from "react";
import { useAuth } from "./AuthContext";

const Login = () => {
  const { login } = useAuth();
  const [loginData, setLoginData] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();
    login(loginData.email, loginData.password);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <div className="bg-[#2d2d2d] p-8 rounded-xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          Login to Your Account
        </h2>
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({ ...loginData, email: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#3d3d3d] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({ ...loginData, password: e.target.value })
              }
              className="w-full px-3 py-2 bg-[#3d3d3d] border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              placeholder="Enter your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-lg font-medium !rounded-button whitespace-nowrap"
            style={{ backgroundColor: "#caff17", color: "#0d0d0d" }}
          >
            Login
          </button>
          <p className="text-sm text-gray-400 text-center mt-4">
            Demo credentials:
            <br />
            Email: user@example.com
            <br />
            Password: password
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;