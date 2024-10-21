// src/app/components/PaidDropdown.js
import { useState } from "react";
import { db } from "@/app/lib/firebase";
import { doc, updateDoc } from "firebase/firestore";

const PaidDropdown = ({ taskId, initialPaidStatus }) => {
  const [paidStatus, setPaidStatus] = useState(initialPaidStatus);

  const handlePaidChange = async (e) => {
    const newStatus = e.target.value;
    setPaidStatus(newStatus);

    // Update the status in Firestore
    await updateDoc(doc(db, "formSubmissions", taskId), {
      paid: newStatus,
    });
  };

  return (
    <select
      value={paidStatus}
      onChange={handlePaidChange}
      className={`p-2 rounded cursor-pointer ${
        paidStatus === "Yes" ? "bg-green-400" : "bg-gray-900"
      }`}
    >
      <option value="No">No</option>
      <option value="Yes" className="bg-green-400 ">
        Yes
      </option>
    </select>
  );
};

export default PaidDropdown;
