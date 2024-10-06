"use client";

import { useState } from "react";
import AssignedTasks from "./AssignedTasks";
import AddNotes from "./AddNotes";
import Accounts from "../Accounts";
import TimeTracker from "../TimeTracker";
import ThemeToggle from "../ThemeToggle";

const EmployeeDashboard = () => {
  const [activeSection, setActiveSection] = useState("assignedTasks");
  const [isAnimating, setIsAnimating] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "assignedTasks":
        return <AssignedTasks />;
      case "timeTracker":
        return <TimeTracker />;
      case "addNotes":
        return <AddNotes />;
      case "accounts":
        return <Accounts />;
      default:
        return <AssignedTasks />;
    }
  };

  const handleSectionChange = (section) => {
    setIsAnimating(true);
    setTimeout(() => {
      setActiveSection(section);
      setIsAnimating(false);
    }, 300);
  };

  return (
    <div className="flex text-white">
      <div className="w-64 h-screen p-6 bg-gray-800 border-r border-gray-700">
        <h1 className="mb-6 text-3xl font-bold text-center ">
          Employee Dashboard
        </h1>

        <ul className="space-y-4">
          <li>
            <button
              className="w-full p-3 transition duration-200 rounded-lg hover:bg-gray-700"
              onClick={() => handleSectionChange("assignedTasks")}
            >
              Assigned Tasks
            </button>
          </li>
          <li>
            <button
              className="w-full p-3 transition duration-200 rounded-lg hover:bg-gray-700"
              onClick={() => handleSectionChange("timeTracker")}
            >
              Time Tracker
            </button>
          </li>
          <li>
            <button
              className="w-full p-3 transition duration-200 rounded-lg hover:bg-gray-700"
              onClick={() => handleSectionChange("accounts")}
            >
              Accounts
            </button>
          </li>
          <li>
            <button
              className="w-full p-3 transition duration-200 rounded-lg hover:bg-gray-700"
              onClick={() => handleSectionChange("addNotes")}
            >
              Add Notes
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content with Animation */}
      <div className="flex-grow p-6">
        <div
          className={`fade-in ${
            isAnimating ? "" : "fade-in-active"
          } transition-opacity duration-300`}
        >
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
