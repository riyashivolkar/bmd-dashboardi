"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/lib/firebase"; // Make sure this path is correct
import { useAuth } from "@/app/utils/context/AuthContext";
import emailjs from "emailjs-com"; // Import EmailJS

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Get the logged-in user

  // Define the employee mapping with their email addresses
  const employeeMapping = {
    "riya.shivolkar511@gmail.com": ["birth", "death"],
    "employee2@example.com": ["ration"],
    "employee3@example.com": ["passport", "food"],
    "employee4@example.com": ["labour", "marriage"],
  };

  // Function to send email using EmailJS
  const sendTaskAssignmentEmail = (employeeEmail, task) => {
    const serviceID = "service_3zfhxfp"; // Replace with your EmailJS service ID
    const templateID = "template_fejsbim"; // Replace with your EmailJS template ID
    const publicKey = "TDye-dCbO1zURoJJL"; // Replace with your EmailJS public key

    const templateParams = {
      to_email: employeeEmail, // Recipient's email address
      task_service: task.service, // Task service name
      client_name: task.name, // Client name
      current_date: new Date().toLocaleDateString(),
    };

    console.log(`Sending email to ${employeeEmail} for task: ${task.service}`);

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

        // Assign tasks to employees based on service
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

        // Filter tasks based on logged-in user
        const filteredTasks = tasksWithEmployees.filter(
          (task) => task.assignedEmployee === user.email
        );

        // Update tasks state
        setTasks(filteredTasks);
        setLoading(false);

        // Send email to assigned employee for new tasks only
        filteredTasks.forEach((task) => {
          if (
            task.assignedEmployee !== "unassigned" &&
            task.taskStatus === "New"
          ) {
            sendTaskAssignmentEmail(task.assignedEmployee, task);
            // Update task status to prevent resending
            updateDoc(doc(db, "formSubmissions", task.id), {
              taskStatus: "Email Sent",
            });
          }
        });
      }
    );

    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [user]);

  // Handle status change
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
    return <div>Loading tasks...</div>;
  }

  return (
    <div>
      <h2 className="text-xl font-bold">Assigned Tasks</h2>
      {tasks.length === 0 ? (
        <p>No tasks assigned to you.</p>
      ) : (
        <table className="min-w-full mt-4 border border-collapse border-gray-800">
          <thead>
            <tr>
              <th className="p-2 border border-gray-800">Sr. No</th>
              <th className="p-2 border border-gray-800">Client Name</th>
              <th className="p-2 border border-gray-800">Service Requested</th>
              <th className="p-2 border border-gray-800">Email</th>
              <th className="p-2 border border-gray-800">Phone No</th>
              <th className="p-2 border border-gray-800">Documents</th>
              <th className="p-2 border border-gray-800">Task Status</th>
              <th className="p-2 border border-gray-800">Time Taken</th>
              <th className="p-2 border border-gray-800">Assigned Employee</th>
              <th className="p-2 border border-gray-800">Add Notes</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, taskIndex) => (
              <tr key={task.id}>
                <td className="p-2 border border-gray-800">{taskIndex + 1}</td>
                <td className="p-2 border border-gray-800">{task.name}</td>
                <td className="p-2 border border-gray-800">{task.service}</td>
                <td className="p-2 border border-gray-800">{task.email}</td>
                <td className="p-2 border border-gray-800">{task.phone}</td>
                <td className="p-2 border border-gray-800">
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
                <td className="p-2 border border-gray-800">
                  <select
                    value={task.taskStatus}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value)
                    }
                    className={`p-1 rounded ${
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
                <td className="p-2 border border-gray-800">{task.timeTaken}</td>
                <td className="p-2 border border-gray-800">
                  {task.assignedEmployee}
                </td>
                <td className="p-2 border border-gray-800">
                  <button className="p-1 text-white bg-blue-500 rounded">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignedTasks;
