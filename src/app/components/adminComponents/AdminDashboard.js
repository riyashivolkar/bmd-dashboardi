"use client";

import { useState } from "react";
import TaskList from "./TaskList";
import EmployeePerformance from "./EmployeeTimeTracker";
import TaskOverview from "./TaskOverview";

import Accounts from "../Accounts";
import NotesSection from "./NotesSection";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("taskList");
  const [isAnimating, setIsAnimating] = useState(false);

  const renderSection = () => {
    switch (activeSection) {
      case "taskList":
        return <TaskList />;
      case "employeePerformance":
        return <EmployeePerformance />;
      case "taskOverview":
        return <TaskOverview />;
      case "notesSection":
        return <NotesSection />;
      case "accounts":
        return <Accounts />;
      default:
        return <TaskList />;
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
    <div className="flex h-screen text-white bg-gray-900">
      {" "}
      {/* Set height to screen */}
      {/* Sidebar */}
      <div className="w-64 h-full p-6 bg-gray-800 border-r border-gray-700">
        <h1 className="mb-6 text-3xl font-bold text-center">Admin Dashboard</h1>
        <ul className="space-y-4">
          <li>
            <button
              className="w-full p-3 transition duration-200 rounded-lg hover:bg-gray-700"
              onClick={() => handleSectionChange("taskList")}
            >
              Task List
            </button>
          </li>

          <li>
            <button
              className="w-full p-3 transition duration-200 rounded-lg hover:bg-gray-700"
              onClick={() => handleSectionChange("employeePerformance")}
            >
              Employee Overview
            </button>
          </li>
          <li>
            <button
              className="w-full p-3 transition duration-200 rounded-lg hover:bg-gray-700"
              onClick={() => handleSectionChange("taskOverview")}
            >
              Tasks Overview Status
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
              onClick={() => handleSectionChange("notesSection")}
            >
              Notes Section
            </button>
          </li>
        </ul>
      </div>
      {/* Main Content with Animation */}
      <div className="flex-grow h-full p-6">
        {" "}
        {/* Set height to full */}
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

export default AdminDashboard;
