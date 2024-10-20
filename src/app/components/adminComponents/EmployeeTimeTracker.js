"use client";

import { useEffect, useState, useRef } from "react";
import { db } from "@/app/lib/firebase";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { useAuth } from "@/app/utils/context/AuthContext";

const EmployeeTimeTracker = () => {
  const { user } = useAuth();
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const [dailySummary, setDailySummary] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date

  const startTimer = () => {
    setIsRunning(true);
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1000); // Increment elapsed time by 1 second
    }, 1000);
  };

  const stopTimer = async () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    await saveElapsedTime(elapsedTime);
  };

  const saveElapsedTime = async (time) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const userDocRef = doc(db, "userSummaries", user.email);

    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const existingSummaries = docSnap.data().dailySummaries || [];
        const todaySummary = { date, hours, minutes };

        const existingSummaryIndex = existingSummaries.findIndex(
          (summary) => summary.date === date
        );

        if (existingSummaryIndex > -1) {
          existingSummaries[existingSummaryIndex].hours += hours;
          existingSummaries[existingSummaryIndex].minutes += minutes;
        } else {
          existingSummaries.push(todaySummary);
        }

        await updateDoc(userDocRef, {
          dailySummaries: existingSummaries,
        });
      } else {
        await updateDoc(userDocRef, {
          dailySummaries: [{ date, hours, minutes }],
        });
      }
    } catch (error) {
      console.error("Error saving elapsed time:", error);
    }

    fetchDailySummary(); // Refresh the daily summary
  };

  useEffect(() => {
    fetchDailySummary(); // Fetch data for all users when the component mounts
  }, []);

  const fetchDailySummary = async () => {
    const userSummariesCollection = collection(db, "userSummaries");
    const snapshot = await getDocs(userSummariesCollection);

    const summaries = snapshot.docs.map((doc) => ({
      email: doc.id,
      dailySummaries: doc.data().dailySummaries || [],
    }));

    setDailySummary(summaries);
  };

  return (
    <div className="flex flex-col items-center p-6 text-white bg-gray-900">
      <h2 className="mb-6 text-3xl font-bold">Employee Time Tracker</h2>

      <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-4 text-left text-gray-200">User Email</th>
            <th className="p-4 text-left text-gray-200">Date</th>
            <th className="p-4 text-left text-gray-200">Total Time</th>
          </tr>
        </thead>
        <tbody>
          {dailySummary.map((userSummary, index) =>
            userSummary.dailySummaries.map((summary, subIndex) => (
              <tr
                key={`${index}-${subIndex}`}
                className="border-b border-gray-700 last:border-none"
              >
                <td className="p-4">{userSummary.email}</td>
                <td className="p-4">{summary.date}</td>
                <td className="p-4">
                  {summary.hours}h {summary.minutes}m
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeTimeTracker;
