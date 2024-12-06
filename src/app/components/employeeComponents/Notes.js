"use client";

import { useEffect, useState } from "react";
import { db } from "@/app/lib/firebase"; // Ensure this path is correct
import { doc, updateDoc } from "firebase/firestore";

const Notes = ({ taskId, initialNote }) => {
  const [note, setNote] = useState(initialNote);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Effect to reset note when initialNote changes
  useEffect(() => {
    setNote(initialNote);
    setIsSubmitted(false);
  }, [initialNote]);

  // Function to handle note updates
  const handleUpdateNote = async () => {
    if (note.trim() === "") return; // Prevent saving empty notes

    const taskDocRef = doc(db, "formSubmissions", taskId);
    await updateDoc(taskDocRef, { note }); // Update the note field
    setIsSubmitted(true);
  };

  // Function to toggle the modal
  const toggleModal = () => {
    setIsModalOpen((prev) => !prev);
    setIsSubmitted(false);
  };

  return (
    <div>
      <button
        onClick={toggleModal}
        className="px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
      >
        {isModalOpen ? "Close Note" : "Notes"}
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <div className="w-full max-w-md p-6 bg-gray-800 rounded-lg shadow-lg">
            <h2 className="mb-4 text-2xl font-bold text-gray-200">Notes</h2>

            <div className="mb-4">
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Enter a note..."
                className="w-full p-2 bg-gray-700 border border-gray-600 rounded"
                rows={4}
              />
              <button
                onClick={handleUpdateNote}
                className="w-full p-2 mt-2 text-white bg-green-500 rounded"
              >
                Update Note
              </button>
              {isSubmitted && (
                <p className="mt-2 text-green-400">
                  Note submitted successfully!
                </p>
              )}
            </div>

            <button
              onClick={toggleModal}
              className="px-6 py-2 mt-4 text-lg text-white bg-blue-600 rounded-md hover:bg-blue-500"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
