import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "../../redux/authActions";
import axios from "axios";

const Navbar = ({ activeSection }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logOut());
    navigate("/log-in");
  };

  const handleProfileClick = () => {
    setModalOpen(true);
    setDropdownOpen(false);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const getAvatar = (name) => {
    if (name) {
      return name.charAt(0).toUpperCase();
    }
    return "U";
  };

  if (!userData) {
    return null;
  }

  const isAdmin = userData.role === "admin";

  return (
    <header className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-500 to-teal-400 shadow-lg rounded mb-6">
      <h1 className="text-3xl font-bold text-white capitalize">
        {activeSection.replace(/([a-z])([A-Z])/g, "$1 $2")}
      </h1>

      <div className="flex items-center space-x-6">
        <div
          className="relative flex items-center space-x-4 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="w-12 h-12 flex items-center justify-center bg-gray-200 text-white rounded-full border-2 border-white shadow-lg">
            <span className="text-lg font-semibold">{getAvatar(userData.name)}</span>
          </div>

          <div className="flex flex-col">
            <span className="text-lg font-medium text-white">{userData.name}</span>
            <span className="text-sm text-gray-100">{userData.email}</span>
          </div>
        </div>

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10">
            {isAdmin ? (
              <>
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none rounded-t-lg"
                  onClick={handleProfileClick}
                >
                  Profile
                </button>
                <button
                  className="block w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none rounded-b-lg"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                className="block w-full px-4 py-2 text-left hover:bg-gray-100 focus:outline-none rounded-b-lg"
                onClick={handleLogout}
              >
                Logout
              </button>
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
          <div className="bg-white rounded-lg p-6 w-96 shadow-2xl transform scale-95 transition-all duration-300">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Profile Details</h2>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 flex items-center justify-center bg-gray-300 text-white rounded-full border-2 border-gray-400">
                  <span className="text-lg font-semibold">{getAvatar(userData.name)}</span>
                </div>
                <p className="text-lg font-medium text-gray-800">{userData.name}</p>
              </div>
              <p><strong>Username:</strong> {userData.username}</p>
              <p><strong>Email:</strong> {userData.email}</p>
            </div>
            <button
              className="mt-4 w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              onClick={handleCloseModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
