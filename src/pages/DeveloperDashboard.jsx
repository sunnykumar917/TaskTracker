import React, { useState } from "react";
import Navbar from "../components/Developer/Navbar";
import Sidebar from "../components/Developer/Sidebar";
import DashboardOverview from "../components/Developer/DashboardOverview";
import AssignedTasks from "../components/Developer/AssignedTasks";
import ProfileSettings from "../components/Developer/ProfileSettings";

const DeveloperDashboard = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardOverview />;
      case "tasks":
        return <AssignedTasks />;
      case "profile":
        return <ProfileSettings />;
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
        <h1 className="text-2xl font-bold mb-4 capitalize"></h1>
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default DeveloperDashboard;
