// "use client";

// import { useEffect, useState } from "react";
// import { updateDoc, doc } from "firebase/firestore";
// import { db } from "@/app/lib/firebase";

// // Helper function to format date
// const formatDate = (date) => {
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();
//   return `${day}/${month}/${year}`;
// };

// // Helper function to add days to a date
// const addDays = (date, days) => {
//   const result = new Date(date);
//   result.setDate(result.getDate() + days);
//   return result;
// };

// const Reminder = ({ task }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [lastReminderStatus, setLastReminderStatus] = useState("no");
//   const [nextReminderStatus, setNextReminderStatus] = useState("no");
//   const [lastReminderDate, setLastReminderDate] = useState("");
//   const [nextReminderDate, setNextReminderDate] = useState("");
//   const [lastReminders, setLastReminders] = useState([]); // Array to store last reminders

//   useEffect(() => {
//     if (task?.createdAt) {
//       const createdAt = task.createdAt.toDate(); // Convert Firestore timestamp to Date object
//       const today = new Date(); // Current date

//       if (task.taskStatus === "In Progress") {
//         const reminders = []; // Array to store all past reminders
//         let currentReminder = new Date(createdAt);

//         // Calculate the reminders starting from `createdAt` every 4 days until today
//         while (currentReminder <= today) {
//           reminders.push(new Date(currentReminder)); // Push each reminder into the array
//           currentReminder = addDays(currentReminder, 4); // Move to the next reminder (4 days later)
//         }

//         // Set the array of past reminders in state
//         setLastReminders(reminders.map((date) => formatDate(date)));

//         // Set the last and next reminder dates
//         const lastReminder = reminders[reminders.length - 1]; // The last reminder date
//         const nextReminder = addDays(lastReminder, 4); // Next reminder 4 days later

//         setLastReminderDate(formatDate(lastReminder)); // Last reminder date
//         setNextReminderDate(formatDate(nextReminder)); // Next reminder date

//         // Set the reminder statuses from the task
//         setLastReminderStatus(task.lastReminderStatus || "no");
//         setNextReminderStatus(task.nextReminderStatus || "no");
//       } else {
//         // If the task is not "In Progress"
//         setLastReminderDate("N/A");
//         setNextReminderDate("N/A");
//         setLastReminders([]);
//         setLastReminderStatus("no");
//         setNextReminderStatus("no");
//       }
//     } else {
//       console.error("createdAt is undefined for task:", task);
//       setLastReminderDate("N/A");
//       setNextReminderDate("N/A");
//       setLastReminders([]);
//     }
//   }, [task]);

//   const handleToggle = () => {
//     setIsModalOpen((prev) => !prev);
//   };

//   const taskDocRef = doc(db, "formSubmissions", task.id);

//   const updateReminderStatus = async (status, isNextReminder) => {
//     if (isNextReminder) {
//       setNextReminderStatus(status);
//     } else {
//       setLastReminderStatus(status);
//     }

//     try {
//       await updateDoc(taskDocRef, {
//         lastReminderStatus: lastReminderStatus,
//         nextReminderStatus: isNextReminder ? status : nextReminderStatus,
//       });
//     } catch (error) {
//       console.error("Error updating reminder status:", error);
//     }
//   };

//   return (
//     <div>
//       <button
//         onClick={handleToggle}
//         className={`flex items-center justify-center p-4 text-white transition ${
//           isModalOpen ? "bg-gray-700" : "bg-gray-600"
//         } rounded-md text-lg`}
//       >
//         {isModalOpen ? "[x] Close Reminder" : "[>] Check Reminder"}
//       </button>

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
//           <div className="w-full max-w-3xl p-6 bg-gray-800 rounded-lg shadow-lg">
//             <h2 className="mb-4 text-2xl font-bold text-gray-200">
//               Status Updated To Client ?
//             </h2>

//             <div className="flex flex-row pb-4 space-x-4 text-blue-500">
//               <p>{task.name}</p>
//               <p>{task.phone}</p>
//               <p>{task.email}</p>
//             </div>

//             {/* Show all previous reminders */}
//             <div className="pb-4">
//               <h3 className="text-gray-300">Previous Reminders:</h3>
//               <ul className="text-gray-400 list-disc list-inside">
//                 {lastReminders.map((date, index) => (
//                   <li key={index}>{date}</li>
//                 ))}
//               </ul>
//             </div>

//             <div className="flex flex-row items-center space-x-5">
//               <p className="text-gray-300">Last Reminder: {lastReminderDate}</p>
//               <div className="flex items-center space-x-2">
//                 <div className="flex items-center text-gray-300">
//                   <input
//                     type="radio"
//                     value="yes"
//                     checked={lastReminderStatus === "yes"}
//                     onChange={() => updateReminderStatus("yes", false)}
//                     className="w-4 h-4 accent-green-500"
//                   />
//                   <span className="ml-2">Yes</span>
//                 </div>
//                 <div className="flex items-center text-gray-300">
//                   <input
//                     type="radio"
//                     value="no"
//                     checked={lastReminderStatus === "no"}
//                     onChange={() => updateReminderStatus("no", false)}
//                     className="w-4 h-4 accent-red-500"
//                   />
//                   <span className="ml-2">No</span>
//                 </div>
//               </div>
//             </div>

//             <div className="flex flex-row items-center py-2 space-x-5">
//               <p className="text-gray-300">Next Reminder: {nextReminderDate}</p>
//               <div className="flex items-center space-x-2">
//                 <div className="flex items-center text-gray-300">
//                   <input
//                     type="radio"
//                     value="yes"
//                     checked={nextReminderStatus === "yes"}
//                     onChange={() => updateReminderStatus("yes", true)}
//                     className="w-4 h-4 accent-green-500"
//                   />
//                   <span className="ml-2">Yes</span>
//                 </div>
//                 <div className="flex items-center text-gray-300">
//                   <input
//                     type="radio"
//                     value="no"
//                     checked={nextReminderStatus === "no"}
//                     onChange={() => updateReminderStatus("no", true)}
//                     className="w-4 h-4 accent-red-500"
//                   />
//                   <span className="ml-2">No</span>
//                 </div>
//               </div>
//             </div>

//             <button
//               onClick={handleToggle}
//               className="px-6 py-3 mt-4 text-lg text-white bg-blue-600 rounded-md hover:bg-blue-500"
//             >
//               Close
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Reminder;

"use client";

import { useEffect, useState } from "react";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

// Helper function to format date
const formatDate = (date) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`; // Format to YYYY-MM-DD
};

// Reminder component
const Reminder = ({ task }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [datesArray, setDatesArray] = useState([]); // Array to store dates
  const [statusUpdates, setStatusUpdates] = useState([]); // Array to store status updates

  useEffect(() => {
    if (task?.createdAt) {
      const createdAt = task.createdAt.toDate(); // Convert Firestore timestamp to Date object
      const today = new Date(); // Current date
      today.setHours(0, 0, 0, 0); // Set today's time to midnight for accurate comparison

      const dateArray = []; // Array to store all dates from createdAt to today
      let currentDate = new Date(createdAt);

      // Push each date into the array until we reach today's date
      while (currentDate <= today) {
        dateArray.push(formatDate(currentDate)); // Push formatted date into the array
        currentDate.setDate(currentDate.getDate() + 1); // Move to the next date (1 day later)
      }

      // Add today's date to the array if it's not already included
      const formattedToday = formatDate(today);
      if (!dateArray.includes(formattedToday)) {
        dateArray.push(formattedToday);
      }

      // Set the array of dates in state
      setDatesArray(dateArray);

      // Fetch existing status updates from Firestore
      const fetchStatusUpdates = async () => {
        const taskDocRef = doc(db, "formSubmissions", task.id);
        const taskDoc = await getDoc(taskDocRef);
        if (taskDoc.exists()) {
          const existingStatusUpdates = taskDoc.data().statusUpdates || {};
          const initialStatusUpdates = dateArray.map((date) => ({
            date: date,
            status: existingStatusUpdates[date] || "", // Set existing status or empty
          }));
          setStatusUpdates(initialStatusUpdates);
        }
      };

      fetchStatusUpdates();
    }
  }, [task]);

  const handleToggle = () => {
    setIsModalOpen((prev) => !prev);
  };

  const handleStatusChange = async (date, status) => {
    // Update the status updates in the state
    const updatedStatus = statusUpdates.map((item) => {
      if (item.date === date) {
        return { ...item, status }; // Update the status for the specific date
      }
      return item;
    });

    // Set the updated status
    setStatusUpdates(updatedStatus);

    // Prepare the updated status for Firestore
    const firestoreStatusUpdates = updatedStatus.reduce((acc, item) => {
      acc[item.date] = item.status; // Store the specific date status
      return acc;
    }, {});

    // Update Firestore with the new status
    const taskDocRef = doc(db, "formSubmissions", task.id);
    try {
      await updateDoc(taskDocRef, {
        statusUpdates: firestoreStatusUpdates, // Store the updated status
      });
    } catch (error) {
      console.error("Error updating status in Firestore:", error);
    }
  };

  return (
    <div>
      <button
        onClick={handleToggle}
        className={`flex items-center justify-center px-4 py-2   text-white transition ${
          isModalOpen ? "bg-gray-700" : "bg-gray-600"
        } rounded-md text-lg`}
      >
        {isModalOpen ? "Reminder" : "Reminder"}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="w-full max-w-3xl p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-200">
              Status Updated To Client?
            </h2>

            <div className="flex flex-row pb-4 space-x-4 text-blue-500">
              <p>{task.name}</p>
              <p>{task.phone}</p>
              <p>{task.email}</p>
            </div>

            <div className="pb-4">
              <table className="min-w-full border border-collapse border-gray-600">
                <thead>
                  <tr>
                    <th className="p-2 text-gray-400 border border-gray-600">
                      Date
                    </th>
                    <th className="p-2 text-gray-400 border border-gray-600">
                      Update Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {datesArray.map((date, index) => (
                    <tr key={index}>
                      <td className="p-2 text-gray-300 border border-gray-600">
                        {date}
                      </td>
                      <td className="p-2 text-gray-300 border border-gray-600">
                        <select
                          value={
                            statusUpdates.find((item) => item.date === date)
                              ?.status || ""
                          }
                          onChange={(e) =>
                            handleStatusChange(date, e.target.value)
                          }
                          className={`text-gray-200 border border-gray-600 rounded-md p-2 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            statusUpdates.find((item) => item.date === date)
                              ?.status === "yes"
                              ? "bg-green-500"
                              : statusUpdates.find((item) => item.date === date)
                                  ?.status === "no"
                              ? "bg-red-500"
                              : "bg-gray-700 hover:bg-gray-600"
                          }`}
                        >
                          <option value="" className="text-gray-400">
                            Select
                          </option>
                          <option value="yes" className="">
                            Yes
                          </option>
                          <option value="no" className="">
                            No
                          </option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <button
              onClick={handleToggle}
              className="px-6 py-3 mt-4 text-lg text-white bg-blue-600 rounded-md hover:bg-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminder;
