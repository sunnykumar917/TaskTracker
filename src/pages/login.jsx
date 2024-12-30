import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authActions";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [loginError, setLoginError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("user"));
    if (loggedInUser) {
      navigate(loggedInUser.role === "admin" ? "/admin-dashboard" : "/developer-dashboard");
    }
  }, [navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!username || !password || !role) {
      setLoginError("All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/users");
      if (!response.ok) {
        throw new Error("Failed to fetch users.");
      }

      const users = await response.json();

      const user = users.find(
        (user) =>
          user.username === username &&
          user.password === password &&
          user.role === role
      );

      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
        dispatch(setUser(user));
        navigate(role === "admin" ? "/admin-dashboard" : "/developer-dashboard");
      } else {
        setLoginError("Invalid credentials or role selection.");
      }
    } catch (error) {
      setLoginError(error.message || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center bg-gradient-to-r from-blue-500 to-purple-500 py-10 min-h-screen">
      <div className="w-full max-w-4xl bg-white shadow-xl rounded-lg p-8 md:p-12 flex flex-col md:flex-row gap-12 h-auto md:h-[510px]">
        <div className="md:w-1/2 mb-6 md:mb-0 flex flex-col items-center md:items-start bg-white p-6 rounded-lg shadow-md h-[calc(50%-0.3rem)]">
          <h3 className="text-4xl font-bold text-gray-800 mb-4 text-center md:text-left">
            Login Form
          </h3>
          <p className="text-gray-600 text-center md:text-left mb-6 text-lg">
            Please log in to access your account and manage your tasks and projects.
          </p>
        </div>

        <div className="md:w-1/2 bg-gray-50 p-6 rounded-lg shadow-md h-[calc(50%-0.3rem)]">
          {loginError && (
            <div className="mb-4 text-red-600 font-medium text-center">
              {loginError}
            </div>
          )}
          <form onSubmit={submitHandler}>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="username">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your username"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2" htmlFor="role">
                Role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring focus:ring-blue-300"
                required
              >
                <option value="">Select a role</option>
                <option value="admin">Admin</option>
                <option value="developer">Developer</option>
              </select>
            </div>

            <div className="mb-6">
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg shadow-md focus:outline-none focus:ring focus:ring-blue-300"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
