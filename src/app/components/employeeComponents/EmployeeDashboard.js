"use client";

import { useState } from "react";
import AssignedTasks from "./AssignedTasks";
import AddNotes from "./AddNotes";
import Accounts from "../Accounts";

const EmployeeDashboard = () => {
  const [activeSection, setActiveSection] = useState("assignedTasks");

  const renderSection = () => {
    switch (activeSection) {
      case "assignedTasks":
        return <AssignedTasks />;
      case "addNotes":
        return <AddNotes />;
      case "accounts":
        return <Accounts />;
      default:
        return <AssignedTasks />;
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 h-screen p-4 text-white bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold">Employee Dashboard</h1>
        <ul>
          <li className="mb-2">
            <button
              className="w-full p-2 text-left rounded hover:bg-gray-700"
              onClick={() => setActiveSection("assignedTasks")}
            >
              Assigned Tasks
            </button>
          </li>
          <li className="mb-2">
            <button
              className="w-full p-2 text-left rounded hover:bg-gray-700"
              onClick={() => setActiveSection("accounts")}
            >
              Accounts
            </button>
          </li>
          <li className="mb-2">
            <button
              className="w-full p-2 text-left rounded hover:bg-gray-700"
              onClick={() => setActiveSection("addNotes")}
            >
              Add Notes
            </button>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-4">{renderSection()}</div>
    </div>
  );
};

export default EmployeeDashboard;
