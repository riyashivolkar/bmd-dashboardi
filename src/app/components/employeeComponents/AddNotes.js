"use client";

import { useState } from "react";

const AddNotes = () => {
  const [note, setNote] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle note submission, e.g., save to database or state
    console.log("Note submitted:", note);
    setNote(""); // Clear the note input
  };

  return (
    <div>
      <h2 className="text-xl font-bold">Add Notes</h2>
      <form onSubmit={handleSubmit} className="mt-4">
        <textarea
          className="w-full p-2 border border-gray-800"
          rows="4"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Write your notes here..."
        />
        <button
          type="submit"
          className="p-2 mt-2 text-white bg-blue-500 rounded"
        >
          Submit Note
        </button>
      </form>
    </div>
  );
};

export default AddNotes;
