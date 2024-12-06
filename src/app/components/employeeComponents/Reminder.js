// "use client";

// import { useEffect, useState } from "react";
// import { updateDoc, doc, getDoc } from "firebase/firestore";
// import { db } from "@/app/lib/firebase";

// // Helper function to format date
// const formatDate = (date) => {
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = String(date.getMonth() + 1).padStart(2, "0");
//   const year = date.getFullYear();
//   return `${year}-${month}-${day}`; // Format to YYYY-MM-DD
// };

// // Reminder component
// const Reminder = ({ task }) => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [datesArray, setDatesArray] = useState([]); // Array to store dates
//   const [statusUpdates, setStatusUpdates] = useState([]); // Array to store status updates
//   const [currentPage, setCurrentPage] = useState(1); // Current page state
//   const entriesPerPage = 5; // Number of entries to display per page

//   useEffect(() => {
//     if (task?.createdAt) {
//       const createdAt = task.createdAt.toDate(); // Convert Firestore timestamp to Date object
//       const today = new Date(); // Current date
//       today.setHours(0, 0, 0, 0); // Set today's time to midnight for accurate comparison

//       const dateArray = []; // Array to store all dates from createdAt to today
//       let currentDate = new Date(createdAt);

//       // Push each date into the array until we reach today's date
//       while (currentDate <= today) {
//         dateArray.push(formatDate(currentDate)); // Push formatted date into the array
//         currentDate.setDate(currentDate.getDate() + 1); // Move to the next date (1 day later)
//       }

//       // Add today's date to the array if it's not already included
//       const formattedToday = formatDate(today);
//       if (!dateArray.includes(formattedToday)) {
//         dateArray.push(formattedToday);
//       }

//       // Set the array of dates in state
//       setDatesArray(dateArray);

//       // Fetch existing status updates from Firestore
//       const fetchStatusUpdates = async () => {
//         const taskDocRef = doc(db, "formSubmissions", task.id);
//         const taskDoc = await getDoc(taskDocRef);
//         if (taskDoc.exists()) {
//           const existingStatusUpdates = taskDoc.data().statusUpdates || {};
//           const initialStatusUpdates = dateArray.map((date) => ({
//             date: date,
//             status: existingStatusUpdates[date] || "", // Set existing status or empty
//           }));
//           setStatusUpdates(initialStatusUpdates);
//         }
//       };

//       fetchStatusUpdates();
//     }
//   }, [task]);

//   const handleToggle = () => {
//     setIsModalOpen((prev) => !prev);
//   };

//   const handleStatusChange = async (date, status) => {
//     // Update the status updates in the state
//     const updatedStatus = statusUpdates.map((item) => {
//       if (item.date === date) {
//         return { ...item, status }; // Update the status for the specific date
//       }
//       return item;
//     });

//     // Set the updated status
//     setStatusUpdates(updatedStatus);

//     // Prepare the updated status for Firestore
//     const firestoreStatusUpdates = updatedStatus.reduce((acc, item) => {
//       acc[item.date] = item.status; // Store the specific date status
//       return acc;
//     }, {});

//     // Update Firestore with the new status
//     const taskDocRef = doc(db, "formSubmissions", task.id);
//     try {
//       await updateDoc(taskDocRef, {
//         statusUpdates: firestoreStatusUpdates, // Store the updated status
//       });
//     } catch (error) {
//       console.error("Error updating status in Firestore:", error);
//     }
//   };

//   // Pagination logic
//   const indexOfLastEntry = currentPage * entriesPerPage; // Last entry index
//   const indexOfFirstEntry = indexOfLastEntry - entriesPerPage; // First entry index
//   const currentEntries = datesArray.slice(indexOfFirstEntry, indexOfLastEntry); // Current entries for the page
//   const totalPages = Math.ceil(datesArray.length / entriesPerPage); // Total pages

//   return (
//     <div>
//       <button
//         onClick={handleToggle}
//         className={`flex items-center justify-center px-4 py-2 text-white transition ${
//           isModalOpen ? "bg-gray-700" : "bg-gray-600"
//         } rounded-md text-lg`}
//       >
//         {isModalOpen ? "Reminder" : "Reminder"}
//       </button>

//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
//           <div className="w-full max-w-3xl p-6 bg-gray-800 rounded-lg shadow-lg">
//             <h2 className="mb-4 text-2xl font-bold text-gray-200">
//               Status Updated To Client?
//             </h2>

//             <div className="flex flex-row pb-4 space-x-4 text-blue-500">
//               <p>{task.name}</p>
//               <p>{task.phone}</p>
//               <p>{task.email}</p>
//             </div>

//             <div className="pb-4">
//               <table className="min-w-full border border-collapse border-gray-600">
//                 <thead>
//                   <tr>
//                     <th className="p-2 text-gray-400 border border-gray-600">
//                       Date
//                     </th>
//                     <th className="p-2 text-gray-400 border border-gray-600">
//                       Update Status
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {currentEntries.map((date, index) => (
//                     <tr key={index}>
//                       <td className="p-2 text-gray-300 border border-gray-600">
//                         {date}
//                       </td>
//                       <td className="p-2 text-gray-300 border border-gray-600">
//                         <select
//                           value={
//                             statusUpdates.find((item) => item.date === date)
//                               ?.status || ""
//                           }
//                           onChange={(e) =>
//                             handleStatusChange(date, e.target.value)
//                           }
//                           className={`text-gray-200 border border-gray-600 rounded-md p-2 transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
//                             statusUpdates.find((item) => item.date === date)
//                               ?.status === "yes"
//                               ? "bg-green-500"
//                               : statusUpdates.find((item) => item.date === date)
//                                   ?.status === "no"
//                               ? "bg-red-500"
//                               : "bg-gray-700 hover:bg-gray-600"
//                           }`}
//                         >
//                           <option value="" className="text-gray-400">
//                             Select
//                           </option>
//                           <option value="yes">Yes</option>
//                           <option value="no">No</option>
//                         </select>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination controls */}
//             <div className="flex justify-between mt-4">
//               <button
//                 onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                 disabled={currentPage === 1}
//                 className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50"
//               >
//                 Previous
//               </button>
//               <span className="text-gray-300">
//                 Page {currentPage} of {totalPages}
//               </span>
//               <button
//                 onClick={() =>
//                   setCurrentPage((prev) => Math.min(prev + 1, totalPages))
//                 }
//                 disabled={currentPage === totalPages}
//                 className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50"
//               >
//                 Next
//               </button>
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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";

const Reminder = ({ task, collection = "formSubmissions" }) => {
  const [selectedDate, setSelectedDate] = useState(null); // State for the selected date

  // Fetch the saved date from Firestore on component mount
  useEffect(() => {
    const fetchReminderDate = async () => {
      if (task && task.id) {
        const taskDocRef = doc(db, collection, task.id);
        try {
          console.log(
            `Fetching reminder for task ${task.id} from collection ${collection}`
          );
          const taskDoc = await getDoc(taskDocRef);
          if (taskDoc.exists() && taskDoc.data().reminderDate) {
            const savedDate = new Date(taskDoc.data().reminderDate); // Convert saved date to a Date object
            setSelectedDate(savedDate); // Initialize the selectedDate state
          }
        } catch (error) {
          console.error("Error fetching reminder date from Firestore:", error);
        }
      }
    };

    fetchReminderDate();
  }, [task, collection]); // Depend on task and collection

  // Handle date selection
  const handleDateChange = async (date) => {
    setSelectedDate(date); // Update the state with the selected date

    if (task && task.id && date) {
      const formattedDate = date.toISOString().split("T")[0]; // Format to YYYY-MM-DD

      // Update Firestore with the selected date
      const taskDocRef = doc(db, collection, task.id);
      try {
        console.log(
          `Saving reminder date for task ${task.id} in collection ${collection}`
        );
        await updateDoc(taskDocRef, {
          reminderDate: formattedDate, // Save the selected date to Firestore
        });
      } catch (error) {
        console.error("Error updating reminder date in Firestore:", error);
      }
    }
  };

  return (
    <div className="flex flex-col items-center p-1 space-y-2 bg-gray-800 rounded-lg">
      <DatePicker
        selected={selectedDate} // Use the fetched date
        onChange={handleDateChange}
        dateFormat="dd-MM-yyyy" // Display format for the date
        className="w-20 px-1 py-2 text-gray-800 rounded-md focus:outline-none"
        placeholderText="Select a date" // Placeholder text
      />
    </div>
  );
};

export default Reminder;
