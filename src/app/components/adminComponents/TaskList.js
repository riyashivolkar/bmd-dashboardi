"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

import { db } from "@/app/lib/firebase";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const employeeMapping = {
    "riya.shivolkar511@gmail.com": ["birth", "death"],
    "employee2@example.com": ["ration"],
    "employee3@example.com": ["passport", "food"],
    "employee4@example.com": ["labour", "marriage"],
  };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasksCollection = collection(db, "formSubmissions");
        const taskDocs = await getDocs(tasksCollection);
        const tasksData = taskDocs.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const tasksWithEmployees = tasksData.map((task) => {
          const assignedEmployee = Object.keys(employeeMapping).find((email) =>
            employeeMapping[email].includes(task.service)
          );

          return {
            id: task.id,
            clientName: task.name || "Unknown Client",
            serviceRequested: task.service || "No Service",
            assignedEmployee: assignedEmployee || "Not Assigned",
            taskStatus: task.taskStatus || "Pending",
            note: task.note || "",
            statusUpdates: task.statusUpdates || {},
          };
        });

        setTasks(tasksWithEmployees);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleUpdateNote = async (taskId, updatedNote) => {
    const task = tasks.find((task) => task.id === taskId);

    if (!task) {
      console.error("Task not found for ID:", taskId);
      return; // Exit if the task is not found
    }

    const taskRef = doc(db, "formSubmissions", taskId);
    try {
      await updateDoc(taskRef, {
        note: updatedNote,
      });

      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === taskId ? { ...task, note: updatedNote } : task
        )
      );
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading tasks...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 text-white bg-gray-900">
      <h2 className="mb-6 text-3xl font-bold text-left">Tasks</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full overflow-hidden bg-gray-800 rounded-lg shadow-md">
          <thead>
            <tr className="bg-gray-700">
              <th className="p-4 text-left text-gray-200">Sr. No.</th>
              <th className="p-4 text-left text-gray-200">Client Name</th>
              <th className="p-4 text-left text-gray-200">Service Requested</th>
              <th className="p-4 text-left text-gray-200">Assigned Employee</th>
              <th className="p-4 text-left text-gray-200">Task Status</th>
              <th className="p-4 text-left text-gray-200">Notes</th>
              <th className="p-4 text-left text-gray-200">Status Updates</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr
                key={task.id}
                className="border-b border-gray-700 last:border-none"
              >
                <td className="p-4">{index + 1}</td>
                <td className="p-4">{task.clientName}</td>
                <td className="p-4">{task.serviceRequested}</td>
                <td className="p-4">{task.assignedEmployee}</td>
                <td className={`p-4 ${getStatusColor(task.taskStatus)}`}>
                  {task.taskStatus}
                </td>
                <td className="p-4">
                  {task.note ? (
                    task.note
                  ) : (
                    <span className="italic text-gray-500">No notes</span>
                  )}
                </td>
                <td className="p-4">
                  {Object.keys(task.statusUpdates).length > 0 ? (
                    <ul>
                      {Object.entries(task.statusUpdates).map(
                        ([date, status], index) => (
                          <li key={index}>
                            {date}:
                            <span
                              className={
                                status === "yes"
                                  ? "text-green-400"
                                  : "text-red-400"
                              }
                            >
                              {status}
                            </span>
                          </li>
                        )
                      )}
                    </ul>
                  ) : (
                    <span className="italic text-gray-500">No updates</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Helper function to determine text color based on task status
const getStatusColor = (status) => {
  switch (status) {
    case "In Progress":
      return "text-orange-400";
    case "Done":
      return "text-green-400";
    case "On Hold":
      return "text-red-400";
    default:
      return "text-gray-400";
  }
};

export default TaskList;
