"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase"; // Ensure this path is correct
import { doc, updateDoc } from "firebase/firestore";

const Notes = ({ taskId, initialNote }) => {
  const [note, setNote] = useState(initialNote);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false); // New state for submission status

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
    setIsSubmitted(false); // Reset submission status when expanding/collapsing
  };

  // Sync note state with initialNote prop
  useEffect(() => {
    setNote(initialNote);
    setIsSubmitted(false); // Reset submission status when initialNote changes
  }, [initialNote]);

  const handleUpdateNote = async () => {
    if (note.trim() === "") return; // Prevent saving empty notes

    // Update Firestore with the new note
    const taskDocRef = doc(db, "formSubmissions", taskId);
    await updateDoc(taskDocRef, { note }); // Update the note field
    setIsSubmitted(true); // Set submission status to true after updating
  };

  return (
    <div className="flex flex-col">
      <button
        className={`p-1 text-white rounded ${
          isExpanded ? "bg-neutral-500" : "bg-gray-700"
        }`}
        onClick={toggleExpand}
      >
        {isExpanded ? "Hide Note" : "Show Note"}
      </button>
      {isExpanded && (
        <div className="p-4 mt-2 bg-gray-800 rounded">
          <div className="mb-4">
            <textarea
              value={note} // Set value to the current note
              onChange={(e) => setNote(e.target.value)} // Update note state on change
              placeholder="Enter a note..."
              className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
              rows={4} // You can set rows to define height
            />
            <button
              onClick={handleUpdateNote}
              className="w-full p-2 mt-2 text-white bg-green-500 rounded"
            >
              Update Note
            </button>
            {isSubmitted && ( // Conditionally render submission status
              <p className="mt-2 text-green-400">
                Note submitted successfully!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
