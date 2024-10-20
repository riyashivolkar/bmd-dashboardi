"use client";

import { useEffect, useState, useRef } from "react";
import { useAuth } from "../utils/context/AuthContext";
import { db } from "@/app/lib/firebase"; // Ensure this path is correct
import { doc, updateDoc, setDoc, getDoc } from "firebase/firestore";

const TimeTracker = () => {
  const { user } = useAuth(); // Get the logged-in user
  const [isRunning, setIsRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const timerRef = useRef(null);
  const [dailySummary, setDailySummary] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]); // Default to today's date

  // Load persisted state from localStorage
  useEffect(() => {
    const storedStartTime = localStorage.getItem("startTime");
    const storedIsRunning = localStorage.getItem("isRunning");

    if (storedStartTime && storedIsRunning === "true") {
      const startTime = parseInt(storedStartTime, 10);
      const currentTime = Date.now();
      const initialElapsedTime = currentTime - startTime;
      setElapsedTime(initialElapsedTime);
      startTimer(true); // Start timer automatically
    }

    if (user) {
      fetchDailySummary(); // Fetch existing daily summaries
    }

    return () => {
      if (isRunning) stopTimer(); // Stop the timer if the component unmounts
    };
  }, [user]);

  const startTimer = (isAutoStart = false) => {
    if (!isAutoStart) {
      setElapsedTime(0); // Reset elapsed time to 0 on manual start
      localStorage.removeItem("startTime"); // Reset start time in localStorage
    }

    setIsRunning(true);
    const startTime = Date.now();
    localStorage.setItem("startTime", startTime); // Save start time in localStorage
    localStorage.setItem("isRunning", "true"); // Save the timer state
    timerRef.current = setInterval(() => {
      setElapsedTime((prev) => prev + 1000); // Increment elapsed time by 1 second
    }, 1000);
  };

  const stopTimer = async () => {
    clearInterval(timerRef.current);
    setIsRunning(false);
    localStorage.removeItem("startTime"); // Clear start time from localStorage
    localStorage.setItem("isRunning", "false"); // Update timer state
    await saveElapsedTime(elapsedTime); // Save the elapsed time to Firestore
  };

  const saveElapsedTime = async (time) => {
    const hours = Math.floor(time / 3600000);
    const minutes = Math.floor((time % 3600000) / 60000);
    const userDocRef = doc(db, "userSummaries", user.email); // Path to user summary document

    try {
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const existingSummaries = docSnap.data().dailySummaries || [];
        const todaySummary = {
          date: date,
          hours: hours,
          minutes: minutes,
        };

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
        await setDoc(userDocRef, {
          dailySummaries: [{ date, hours, minutes }],
        });
      }
    } catch (error) {
      console.error("Error saving elapsed time:", error);
    }

    setDailySummary((prev) => [
      ...prev,
      { date, hours: hours + Math.floor(minutes / 60), minutes },
    ]);
  };

  const fetchDailySummary = async () => {
    const userDocRef = doc(db, "userSummaries", user.email);
    const docSnap = await getDoc(userDocRef);
    if (docSnap.exists()) {
      const summaries = docSnap.data().dailySummaries || [];
      setDailySummary(summaries);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 text-white bg-gray-900">
      <h2 className="mb-6 text-3xl font-bold">Time Tracker</h2>
      <div className="flex items-center w-full py-2 pb-6 justify-evenly">
        <div className="mb-4 text-2xl">
          Elapsed Time: {new Date(elapsedTime).toISOString().substr(11, 8)}{" "}
        </div>
        <div className="flex items-center space-x-4">
          {!isRunning && (
            <>
              <button
                onClick={() => startTimer()}
                className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-700"
              >
                Start
              </button>
              <span className="italic text-yellow-400 ">
                Timer has stopped...
              </span>
            </>
          )}
          {isRunning && (
            <>
              <button
                onClick={stopTimer}
                className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-700"
              >
                Stop
              </button>
              <span className="italic text-yellow-400 align-bottom">
                Timer is running...
              </span>
            </>
          )}
        </div>
      </div>

      <table className="min-w-full bg-gray-800 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-4 text-left text-gray-200">Date</th>
            <th className="p-4 text-left text-gray-200">Hours</th>
            <th className="p-4 text-left text-gray-200">Minutes</th>
          </tr>
        </thead>
        <tbody>
          {dailySummary.map((summary, index) => (
            <tr
              key={index}
              className="border-b border-gray-700 last:border-none"
            >
              <td className="p-4">{summary.date}</td>
              <td className="p-4">{summary.hours}</td>
              <td className="p-4">{summary.minutes}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TimeTracker;
