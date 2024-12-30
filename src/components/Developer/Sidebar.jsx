import React from "react";
import { useDispatch } from "react-redux";
import { logOut } from "../../redux/authActions";
import { useNavigate } from "react-router-dom";

const DeveloperSidebar = ({ activeSection, setActiveSection }) => {
  const menuItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "tasks", label: "My Tasks" },
    { id: "profile", label: "Profile" },
  ];

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    dispatch(logOut());
    navigate("/log-in");
  };

  return (
    <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white h-screen flex flex-col">
      <div className="p-6 text-2xl font-bold text-center border-b border-gray-700">Developer Panel</div>
      <nav className="flex flex-col flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveSection(item.id)}
            className={`w-full text-left p-3 rounded-lg transition-colors shadow-sm hover:bg-gray-700 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
              activeSection === item.id
                ? "bg-gray-700 shadow-inner border-l-4 border-indigo-500"
                : ""
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          className="w-full py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-gray-800"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default DeveloperSidebar;
