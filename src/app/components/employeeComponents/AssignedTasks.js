"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/app/utils/context/AuthContext";
import emailjs from "emailjs-com";
import Notes from "./Notes";
import Reminder from "./Reminder"; // Import the Reminder component
import ThemeToggle from "../ThemeToggle";

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const employeeMapping = {
    "riya.shivolkar511@gmail.com": ["birth", "death"],
    "employee2@example.com": ["ration"],
    "employee3@example.com": ["passport", "food"],
    "employee4@example.com": ["labour", "marriage"],
  };

  const sendTaskAssignmentEmail = (employeeEmail, task) => {
    const serviceID = "service_3zfhxfp";
    const templateID = "template_fejsbim";
    const publicKey = "TDye-dCbO1zURoJJL";

    const templateParams = {
      to_email: employeeEmail,
      task_service: task.service,
      client_name: task.name,
      current_date: new Date().toLocaleDateString(),
    };

    emailjs
      .send(serviceID, templateID, templateParams, publicKey)
      .then((response) => {
        console.log("Email sent successfully!", response.status, response.text);
      })
      .catch((error) => {
        console.error("Failed to send email:", error);
      });
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "formSubmissions"),
      (snapshot) => {
        const tasksData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        const tasksWithEmployees = tasksData.map((task) => {
          const assignedEmployee = employeeMapping[user.email]?.includes(
            task.service
          )
            ? user.email
            : "unassigned";
          return {
            ...task,
            assignedEmployee,
            taskStatus: task.taskStatus || "New",
          };
        });

        const filteredTasks = tasksWithEmployees.filter(
          (task) => task.assignedEmployee === user.email
        );

        setTasks(filteredTasks);
        setLoading(false);

        filteredTasks.forEach((task) => {
          if (
            task.assignedEmployee !== "unassigned" &&
            task.taskStatus === "New"
          ) {
            sendTaskAssignmentEmail(task.assignedEmployee, task);

            updateDoc(doc(db, "formSubmissions", task.id), {
              taskStatus: "Email Sent",
            });
          }
        });
      }
    );

    return () => unsubscribe();
  }, [user]);

  const handleStatusChange = async (id, newStatus) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, taskStatus: newStatus } : task
      )
    );

    const taskDocRef = doc(db, "formSubmissions", id);
    try {
      await updateDoc(taskDocRef, { taskStatus: newStatus });
      console.log(`Task status updated in Firestore: ${newStatus}`);
    } catch (error) {
      console.error("Error updating task status in Firestore:", error);
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
    <div className="min-h-screen p-6 ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex-1 text-3xl font-bold text-center ">Tasks</h2>

        <div className="ml-4">{/* <ThemeToggle /> */}</div>
      </div>
      {tasks.length === 0 ? (
        <p className="text-center">No tasks assigned to you.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full overflow-hidden bg-gray-800 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-4 text-left text-gray-200">Sr. No</th>
                <th className="p-4 text-left text-gray-200">Client Name</th>
                <th className="p-4 text-left text-gray-200">Service</th>
                <th className="p-4 text-left text-gray-200">Client Email</th>
                <th className="p-4 text-left text-gray-200">Phone</th>
                <th className="p-4 text-left text-gray-200">Documents</th>
                <th className="p-4 text-left text-gray-200">Task Status</th>
                <th className="p-4 text-left text-gray-200">Add Notes</th>
                <th className="p-4 text-left text-gray-200">Client Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, taskIndex) => (
                <tr
                  key={task.id}
                  className="border-b border-gray-700 last:border-none"
                >
                  <td className="p-4">{taskIndex + 1}</td>
                  <td className="p-4">{task.name}</td>
                  <td className="p-4">{task.service}</td>
                  <td className="p-4">{task.email}</td>
                  <td className="p-4">{task.phone}</td>
                  <td className="p-4">
                    {task.documents.length > 0
                      ? task.documents.map((doc, index) => (
                          <div
                            key={`${task.id}-${index}`}
                            className="flex items-center space-x-2"
                          >
                            <a
                              href={doc}
                              className="text-blue-500"
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              Document {index + 1}
                            </a>
                          </div>
                        ))
                      : "No documents"}
                  </td>
                  <td className="p-4">
                    <select
                      value={task.taskStatus}
                      onChange={(e) =>
                        handleStatusChange(task.id, e.target.value)
                      }
                      className={`p-2 rounded ${
                        task.taskStatus === "In Progress"
                          ? "bg-orange-500"
                          : task.taskStatus === "Done"
                          ? "bg-green-500"
                          : task.taskStatus === "On Hold"
                          ? "bg-red-500"
                          : "bg-gray-900"
                      }`}
                    >
                      <option value="New">New</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Done">Done</option>
                      <option value="On Hold">On Hold</option>
                    </select>
                  </td>
                  <td className="p-4">
                    <Notes taskId={task.id} initialNote={task.note || ""} />
                  </td>
                  <td className="p-4">
                    <Reminder task={task} />{" "}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignedTasks;
