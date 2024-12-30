import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ProfileSettings = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newName, setNewName] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const loggedInUser = JSON.parse(localStorage.getItem("user"));
      if (!loggedInUser) {
        navigate("/log-in");
        return;
      }

      if (loggedInUser.role !== "developer") {
        navigate("/not-authorized");
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
    if (name === "oldPassword") setOldPassword(value);
    if (name === "newPassword") setNewPassword(value);
  };

  const handleUpdateProfile = async (field) => {
    if (field === "name") {
      if (!newName) {
        setError("Name cannot be empty.");
        return;
      }
      try {
        await axios.put(`http://localhost:5000/users/${userData.id}`, {
          ...userData,
          name: newName,
        });
        setUserData({ ...userData, name: newName });
        toast.success("Name updated successfully!");
      } catch (error) {
        console.error("Error updating name:", error);
        setError("Failed to update name.");
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
      try {
        await axios.put(`http://localhost:5000/users/${userData.id}`, {
          ...userData,
          password: newPassword,
        });
        setUserData({ ...userData, password: newPassword });
        toast.success("Password updated successfully!");
      } catch (error) {
        console.error("Error updating password:", error);
        setError("Failed to update password.");
      }
    }
    setIsEditingProfile(false);
  };

  return (
    <div className="container py-4">
      <h2 className="text-lg font-medium mb-4">Profile Settings</h2>

      <div className="space-y-4">
        <div className="mb-3">
          <h3 className="text-lg font-medium">Full Name: {userData.name}</h3>
        </div>
        <div className="mb-3">
          <h3 className="text-lg font-medium">Username: {userData.username}</h3>
        </div>
        <div className="mb-3">
          <h3 className="text-lg font-medium">Email: {userData.email}</h3>
        </div>

        <button
          onClick={() => setIsEditingProfile(true)}
          className="btn btn-primary"
        >
          Edit Profile
        </button>

        {isEditingProfile && (
          <div className="dialog mt-4 p-4 border rounded shadow-lg bg-white">
            <h3 className="text-lg font-medium">What do you want to update?</h3>
            <div className="space-x-2">
              <button
                onClick={() => setIsEditingName(true)}
                className="btn btn-warning"
              >
                Update Name
              </button>
              <button
                onClick={() => setIsEditingPassword(true)}
                className="btn btn-warning"
              >
                Update Password
              </button>
            </div>
          </div>
        )}

        {isEditingName && (
          <div className="dialog mt-4 p-4 border rounded shadow-lg bg-white">
            <h3>Current Name: {userData.name}</h3>
            <input
              type="text"
              name="newName"
              value={newName}
              onChange={handleInputChange}
              className="form-control mb-3"
              placeholder="New Name"
            />
            <button
              onClick={() => handleUpdateProfile("name")}
              className="btn btn-success"
            >
              Update Name
            </button>
            <button
              onClick={() => setIsEditingName(false)}
              className="btn btn-secondary ml-2"
            >
              Go Back
            </button>
          </div>
        )}

        {isEditingPassword && (
          <div className="dialog mt-4 p-4 border rounded shadow-lg bg-white">
            <h3>Enter New Password:</h3>
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
              Update Password
            </button>
            <button
              onClick={() => setIsEditingPassword(false)}
              className="btn btn-secondary ml-2"
            >
              Go Back
            </button>
          </div>
        )}
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </div>
  );
};

export default ProfileSettings;
