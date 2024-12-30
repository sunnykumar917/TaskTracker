import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOut } from "../../redux/authActions";

const Sidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "manageUsers", label: "Manage Users" },
    { id: "manageProjects", label: "Manage Projects" },
    { id: "settings", label: "Settings" },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logOut());
    navigate("/log-in");
  };

  return (
    <div className="w-1/5 bg-gray-800 text-white flex flex-col h-full">
      <div className="p-6 text-2xl font-bold text-center border-b border-gray-700">
        Admin Dashboard
      </div>
      <nav className="flex flex-col p-4 space-y-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`p-3 text-left rounded-lg hover:bg-gray-700 transition-colors ${
              activeSection === item.id ? "bg-gray-700" : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto p-4">
        <button
          className="w-full p-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
