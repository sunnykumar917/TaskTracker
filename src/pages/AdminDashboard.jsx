import React, { useState } from "react";
import Navbar from "../components/Admin/Navbar";
import Sidebar from "../components/Admin/Sidebar";
import DashboardOverview from "../components/Admin/DashboardOverview";
import UserManagement from "../components/Admin/UserManagement";
import ManageProject from "../components/Admin/ManageProject";
import Settings from "../components/Admin/Settings";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "manageUsers":
        return <UserManagement />;
      case "manageProjects":
        return <ManageProject />;
      case "settings":
        return <Settings />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activeSection={activeSection} setActiveSection={setActiveSection} />
      <div className="flex-1 bg-gray-100 p-6 overflow-y-auto">
        <Navbar activeSection={activeSection} />
        <div>
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
