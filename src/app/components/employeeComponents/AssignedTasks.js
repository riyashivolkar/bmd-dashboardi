import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/app/utils/context/AuthContext";
import emailjs from "emailjs-com";
import Notes from "./Notes";
import Reminder from "./Reminder"; // Import the Reminder component
import ThemeToggle from "../ThemeToggle";
import Payment from "../payment";

const AssignedTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const [filteredTasks, setFilteredTasks] = useState([]);

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
    // Fetch form submissions
    const unsubscribeForm = onSnapshot(
      collection(db, "formSubmissions"),
      (snapshot) => {
        const tasksData = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((task) => task.orderId && task.createdAt); // Filter tasks with orderId and createdAt
        setTasks(tasksData);
        setLoading(false);
      }
    );

    // Fetch payments
    const unsubscribePayments = onSnapshot(
      collection(db, "payments"),
      (snapshot) => {
        const paymentsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPayments(paymentsData);
      }
    );

    return () => {
      unsubscribeForm();
      unsubscribePayments();
    };
  }, []);

  useEffect(() => {
    if (tasks.length > 0 && payments.length > 0) {
      const paymentOrderIds = new Set(
        payments.map((payment) => payment.orderId)
      );
      // Filter tasks based on whether their orderId is in the set of orderIds
      const updatedFilteredTasks = tasks.filter(
        (task) => paymentOrderIds.has(task.orderId) // Check against orderId
      );
      setFilteredTasks(updatedFilteredTasks);
    }
  }, [tasks, payments]); // Only depend on tasks and payments

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

  console.log("Tasks:", tasks);
  console.log("Payments:", payments);
  console.log("Filtered Tasks:", filteredTasks);

  return (
    <div className="min-h-screen p-6 ">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex-1 text-3xl font-bold text-center ">Tasks</h2>
        <div className="ml-4">{/* <ThemeToggle /> */}</div>
      </div>
      {filteredTasks.length === 0 ? (
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
                <th className="p-4 text-left text-gray-200">
                  Payment Status
                </th>{" "}
                {/* New Column Header */}
              </tr>
            </thead>
            <tbody>
              {filteredTasks.map((task, taskIndex) => {
                // Find the corresponding payment for the task
                const payment = payments.find(
                  (p) => p.orderId === task.orderId
                );
                const paymentStatus = payment ? payment.status : "Pending"; // Default to "Pending" if no payment found

                return (
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
                    <td className="p-4">{paymentStatus}</td>{" "}
                    {/* Payment Status Display */}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AssignedTasks;
