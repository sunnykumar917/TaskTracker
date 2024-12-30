import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ activeSection }) => {
  const [userData, setUserData] = useState({ name: "Sunny", email: "sunny@example.com" });
  const [notifications, setNotifications] = useState(0);

  useEffect(() => {
    const userFromLS = JSON.parse(localStorage.getItem("user"));
    if (userFromLS && userFromLS.username) {
      axios
        .get(`http://localhost:5000/users?username=${userFromLS.username}`)
        .then((response) => {
          if (response.data.length > 0) {
            setUserData(response.data[0]);
          }
        });
    }
    const interval = setInterval(() => {
      setNotifications((prev) => prev + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleNotificationClick = () => {
    toast.info("You have new notifications!");
  };

  const getAvatar = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  return (
    <div className="bg-white shadow-md p-4 flex justify-between items-center">
      <h2 className="text-xl font-semibold text-gray-800">{activeSection?.toUpperCase()}</h2>
      <div className="flex items-center space-x-6">
        <div className="relative cursor-pointer" onClick={handleNotificationClick}>
          <span className="absolute top-0 right-0 h-5 w-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
            {notifications}
          </span>
          <FaBell className="text-gray-700 text-3xl" />
        </div>
        {userData && (
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center bg-gray-300 text-white rounded-full">
              <span className="text-xl font-semibold">{getAvatar(userData.name)}</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm text-gray-700">{userData.name || "Default Name"}</span>
              <span className="text-xs text-gray-500">{userData.email || "default@example.com"}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
