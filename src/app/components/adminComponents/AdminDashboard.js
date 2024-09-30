"use client";

import { useState } from "react";
import TaskList from "./TaskList";
import EmployeePerformance from "./EmployeePerformance";
import TaskOverview from "./TaskOverview";
import NotesSection from "../NotesSection";
import Accounts from "../Accounts";

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("taskList");

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
      case "Accounts":
        return <Accounts />;
      default:
        return <TaskList />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen p-4 text-white bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold">Dashboard</h1>
        <ul>
          <li className="mb-2">
            <button
              className="w-full p-2 text-left rounded hover:bg-gray-700"
              onClick={() => setActiveSection("taskList")}
            >
              Task List
            </button>
          </li>
          <li className="mb-2">
            <button
              className="w-full p-2 text-left rounded hover:bg-gray-700"
              onClick={() => setActiveSection("employeePerformance")}
            >
              Employee Performance Overview
            </button>
          </li>
          <li className="mb-2">
            <button
              className="w-full p-2 text-left rounded hover:bg-gray-700"
              onClick={() => setActiveSection("taskOverview")}
            >
              Task Overview by Status
            </button>
          </li>
          <li className="mb-2">
            <button
              className="w-full p-2 text-left rounded hover:bg-gray-700"
              onClick={() => setActiveSection("Accounts")}
            >
              Accounts
            </button>
          </li>
          <li className="mb-2">
            <button
              className="w-full p-2 text-left rounded hover:bg-gray-700"
              onClick={() => setActiveSection("notesSection")}
            >
              Notes Section
            </button>
          </li>
        </ul>
      </div>

      <div className="flex-grow p-4">{renderSection()}</div>
    </div>
  );
};

export default AdminDashboard;
