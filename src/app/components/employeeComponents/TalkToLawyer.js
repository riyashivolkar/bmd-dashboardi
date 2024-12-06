"use client";
import Pagination from "../Pagination";
import { useEffect, useState } from "react";
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { db } from "@/app/lib/firebase";
import { useAuth } from "@/app/utils/context/AuthContext";
import TaskDate from "../TaskDate"; // Reuse TaskDate for `createdAt`
import Notes from "./Notes";
import Reminder from "./Reminder";

const TalkToLawyer = () => {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const [currentPage, setCurrentPage] = useState(1);
  const casesPerPage = 15;

  const indexOfLastCase = currentPage * casesPerPage;
  const indexOfFirstCase = indexOfLastCase - casesPerPage;
  const currentCases = cases.slice(indexOfFirstCase, indexOfLastCase);
  const [expandedCases, setExpandedCases] = useState({});

  // Calculate total number of pages
  const totalPages = Math.ceil(cases.length / casesPerPage);

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // Get a reference to the document in Firestore
      const taskRef = doc(db, "talktolawyer", taskId);

      // Update the `taskStatus` field in Firestore
      await updateDoc(taskRef, {
        taskStatus: newStatus,
      });

      // Update the local state
      setCases((prevCases) =>
        prevCases.map((caseItem) =>
          caseItem.id === taskId
            ? { ...caseItem, taskStatus: newStatus }
            : caseItem
        )
      );

      console.log(`Task ${taskId} status updated to ${newStatus}`);
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  const toggleCaseDetails = (caseId) => {
    setExpandedCases((prevState) => ({
      ...prevState,
      [caseId]: !prevState[caseId], // Toggle the expanded state for the case
    }));
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "talktolawyer"),
      (snapshot) => {
        const casesData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Sort cases by 'createdAt' field in descending order (latest first)
        const sortedCases = casesData.sort(
          (a, b) => b.createdAt?.seconds - a.createdAt?.seconds
        );

        setCases(sortedCases);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-white">
        Loading cases...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="flex-1 text-3xl font-bold text-center">
          Talk To Lawyer
        </h2>
      </div>
      {currentCases.length === 0 ? (
        <p className="text-center"></p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full overflow-hidden bg-gray-800 rounded-lg shadow-md">
            <thead>
              <tr className="bg-gray-700">
                <th className="p-4 text-left text-gray-200">Sr. No</th>
                <th className="p-4 text-left text-gray-200">Date</th>
                <th className="p-4 text-left text-gray-200">Email</th>
                <th className="p-4 text-left text-gray-200">Phone</th>
                <th className="p-4 text-left text-gray-200">City</th>
                <th className="p-4 text-left text-gray-200">Subcategory</th>
                <th className="p-4 text-left text-gray-200">Selected Date</th>
                <th className="p-4 text-left text-gray-200">Selected Slot</th>
                <th className="p-4 text-left text-gray-200">Languages</th>
                <th className="p-4 text-left text-gray-200">Case Details</th>
                <th className="p-4 text-left text-gray-200">Task Status</th>
                <th className="p-4 text-left text-gray-200"> Notes</th>
                <th className="p-4 text-left text-gray-200">Daily</th>
              </tr>
            </thead>
            <tbody>
              {currentCases.map((caseItem, caseIndex) => (
                <tr
                  key={caseItem.id}
                  className={`border-b border-gray-700 last:border-none ${
                    caseItem.taskStatus === "In Progress"
                      ? "bg-orange-500"
                      : caseItem.taskStatus === "Done"
                      ? "bg-green-500"
                      : caseItem.taskStatus === "On Hold"
                      ? "bg-red-500"
                      : "bg-gray-900"
                  }`}
                >
                  <td className="p-4">
                    {currentCases.length - (indexOfFirstCase + caseIndex)}
                  </td>
                  <td className="p-4">
                    <TaskDate timestamp={caseItem.createdAt} />
                  </td>
                  <td className="p-4">{caseItem.email}</td>
                  <td className="p-4">{caseItem.phone}</td>
                  <td className="p-4">{caseItem.city}</td>
                  <td className="p-4">{caseItem.subcategory}</td>
                  <td className="p-4">{caseItem.selectedDate}</td>
                  <td className="p-4">{caseItem.selectedSlot}</td>
                  <td className="p-4">{caseItem.languages}</td>
                  <td className="p-4">
                    <div className="relative">
                      <p className="p-4">
                        {expandedCases[caseItem.id]
                          ? caseItem.caseDetails
                          : caseItem.caseDetails &&
                            caseItem.caseDetails.length > 0
                          ? `${caseItem.caseDetails.substring(0, 70)}...`
                          : ""}
                      </p>

                      {caseItem.caseDetails &&
                        caseItem.caseDetails.length > 0 && (
                          <button
                            onClick={() => toggleCaseDetails(caseItem.id)}
                            className="px-2 py-1 text-indigo-500 bg-gray-900 hover:bg-gray-900 "
                          >
                            {expandedCases[caseItem.id] ? "Less" : "More"}
                          </button>
                        )}
                    </div>
                  </td>

                  <td className="p-4">
                    <select
                      value={caseItem.taskStatus}
                      onChange={(e) =>
                        handleStatusChange(caseItem.id, e.target.value)
                      }
                      className={`p-2 rounded border border-white ${
                        caseItem.taskStatus === "In Progress"
                          ? "bg-orange-500"
                          : caseItem.taskStatus === "Done"
                          ? "bg-green-500"
                          : caseItem.taskStatus === "On Hold"
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
                    <Notes
                      taskId={caseItem.id}
                      initialNote={caseItem.note || ""}
                    />
                  </td>
                  <td className="p-4">
                    <Reminder task={caseItem} collection="talktolawyer" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default TalkToLawyer;
