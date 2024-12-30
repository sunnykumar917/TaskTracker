import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [userData, setUserData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
  });
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingUsername, setIsEditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      if (!loggedInUser) {
        navigate("/log-in");
        return;
      }
      try {
        const response = await axios.get(
          `http://localhost:5000/users?username=${loggedInUser.username}`
        );
        if (response.data.length > 0) {
          setUserData(response.data[0]);
        } else {
          console.error("User not found in the database.");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to fetch user data.");
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "newName") setNewName(value);
    if (name === "newUsername") setNewUsername(value);
    if (name === "oldPassword") setOldPassword(value);
    if (name === "newPassword") setNewPassword(value);
  };

  const handleUpdateProfile = async (field) => {
    if (field === "name") {
      if (!newName) {
        setError("Name cannot be empty.");
        return;
      }
      const updatedUserData = { ...userData, name: newName };
      setUserData(updatedUserData);
      try {
        await axios.put(`http://localhost:5000/users/${userData.id}`, updatedUserData);
        toast.success("Name updated successfully!");
      } catch (error) {
        console.error("Error updating name:", error);
        setError("Failed to update name.");
      }
    } else if (field === "username") {
      if (!newUsername) {
        setError("Username cannot be empty.");
        return;
      }
      const updatedUserData = { ...userData, username: newUsername };
      setUserData(updatedUserData);
      try {
        await axios.put(`http://localhost:5000/users/${userData.id}`, updatedUserData);
        toast.success("Username updated successfully!");
      } catch (error) {
        console.error("Error updating username:", error);
        setError("Failed to update username.");
      }
    } else if (field === "password") {
      if (oldPassword !== userData.password) {
        setError("Old password doesn't match.");
        toast.error("Old password doesn't match.");
        return;
      }
      if (!newPassword) {
        setError("New password cannot be empty.");
        return;
      }
      const updatedUserData = { ...userData, password: newPassword };
      setUserData(updatedUserData);
      try {
        await axios.put(`http://localhost:5000/users/${userData.id}`, updatedUserData);
        toast.success("Password updated successfully!");
      } catch (error) {
        console.error("Error updating password:", error);
        setError("Failed to update password.");
      }
    }
  };

  return (
    <div
      className={`min-h-screen bg-${isDarkMode ? "dark" : "light"} text-${
        isDarkMode ? "light" : "dark"
      }`}
    >
      <div className="container py-4">
        <h1 className="text-3xl font-bold text-center mb-6">User Settings</h1>
        <div className="space-y-4">
          <h2 className="text-lg font-medium">Account Details:</h2>
          <p><strong>Name:</strong> {userData.name}</p>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <button onClick={() => setIsEditingName(true)} className="btn btn-warning me-2">
            Update Name
          </button>
          <button onClick={() => setIsEditingUsername(true)} className="btn btn-warning me-2">
            Update Username
          </button>
          <button onClick={() => setIsEditingPassword(true)} className="btn btn-warning">
            Update Password
          </button>
          <div className="mt-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isDarkMode}
                onChange={() => setIsDarkMode(!isDarkMode)}
                className="form-checkbox"
              />
              <span className="ml-2 text-lg">Enable Dark Mode</span>
            </label>
          </div>
        </div>
        {isEditingName && (
          <div className="dialog mt-4 p-4 border rounded shadow-lg bg-white">
            <h3>Update Name</h3>
            <input
              type="text"
              name="newName"
              value={newName}
              onChange={handleInputChange}
              className="form-control mb-3"
              placeholder="New Name"
            />
            <button onClick={() => handleUpdateProfile("name")} className="btn btn-success">
              Save Name
            </button>
            <button
              onClick={() => setIsEditingName(false)}
              className="btn btn-secondary ml-2"
            >
              Cancel
            </button>
          </div>
        )}
        {isEditingUsername && (
          <div className="dialog mt-4 p-4 border rounded shadow-lg bg-white">
            <h3>Update Username</h3>
            <input
              type="text"
              name="newUsername"
              value={newUsername}
              onChange={handleInputChange}
              className="form-control mb-3"
              placeholder="New Username"
            />
            <button
              onClick={() => handleUpdateProfile("username")}
              className="btn btn-success"
            >
              Save Username
            </button>
            <button
              onClick={() => setIsEditingUsername(false)}
              className="btn btn-secondary ml-2"
            >
              Cancel
            </button>
          </div>
        )}
        {isEditingPassword && (
          <div className="dialog mt-4 p-4 border rounded shadow-lg bg-white">
            <h3>Update Password</h3>
            <input
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={handleInputChange}
              className="form-control mb-3"
              placeholder="Old Password"
            />
            <input
              type="password"
              name="newPassword"
              value={newPassword}
              onChange={handleInputChange}
              className="form-control mb-3"
              placeholder="New Password"
            />
            <button
              onClick={() => handleUpdateProfile("password")}
              className="btn btn-success"
            >
              Save Password
            </button>
            <button
              onClick={() => setIsEditingPassword(false)}
              className="btn btn-secondary ml-2"
            >
              Cancel
            </button>
          </div>
        )}
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
};

export default Settings;
