"use client"; // Ensure this is a client component

import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Define the employee mapping
  const employeeMapping = {
    birth: "employee1",
    death: "employee1",
    ration: "employee2",
    passport: "employee3",
    food: "employee3",
    labour: "employee4",
    marraige: "employee4",
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

        // Set the tasks state with relevant fields and assigned employees
        const tasksWithEmployees = tasksData.map((task) => ({
          clientName: task.name, // Assuming you have 'name' in your document
          serviceRequested: task.service, // Assuming you have 'service' in your document
          assignedEmployee: employeeMapping[task.service] || "Not Assigned", // Get assigned employee from mapping
          taskStatus: task.taskStatus || "Pending", // Fetch task status from Firestore or set default
          timeTaken: task.timeTaken || "0h 0m", // Fetch or default time taken
          notes: task.notes || "", // Fetch notes or set default empty
        }));

        setTasks(tasksWithEmployees);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Assigned Tasks</h2>

      <table className="min-w-full mt-4 border border-collapse border-gray-800">
        <thead>
          <tr className="text-black bg-gray-200">
            <th className="p-2 border border-gray-900">Sr. No.</th>
            <th className="p-2 border border-gray-900">Client Name</th>
            <th className="p-2 border border-gray-900">Service Requested</th>
            <th className="p-2 border border-gray-900">Assigned Employee</th>
            <th className="p-2 border border-gray-900">Task Status</th>
            <th className="p-2 border border-gray-900">Time Taken</th>
            <th className="p-2 border border-gray-900">Notes</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, index) => (
            <tr key={task.id}>
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{task.clientName}</td>
              <td className="p-2 border">{task.serviceRequested}</td>
              <td className="p-2 border">{task.assignedEmployee}</td>
              <td
                className={`p-2 border ${
                  task.taskStatus === "In Progress"
                    ? "text-orange-500"
                    : task.taskStatus === "Done"
                    ? "text-green-500"
                    : task.taskStatus === "On Hold"
                    ? "text-red-500"
                    : "text-gray-200"
                }`}
              >
                {task.taskStatus}
              </td>
              <td className="p-2 border">{task.timeTaken}</td>
              <td className="p-2 border">{task.notes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskList;
