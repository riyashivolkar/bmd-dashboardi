// TimeTaken.js

import React, { useState, useEffect } from "react";

const TimeTaken = ({ taskId, onTimeUpdate }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let timer;
    if (isRunning) {
      timer = setInterval(() => {
        setSeconds((prev) => prev + 1);
        onTimeUpdate(taskId, seconds + 1); // Notify the parent component with the updated time
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, seconds, taskId, onTimeUpdate]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
  };

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="flex flex-col">
      <p className="text-white">Time Taken: {formatTime()}</p>
      <div className="flex space-x-2">
        <button
          onClick={startTimer}
          className="p-2 text-white bg-green-500 rounded"
        >
          Start
        </button>
        <button
          onClick={stopTimer}
          className="p-2 text-white bg-red-500 rounded"
        >
          Stop
        </button>
        <button
          onClick={resetTimer}
          className="p-2 text-white bg-gray-500 rounded"
        >
          Reset
        </button>
      </div>
    </div>
  );
};

export default TimeTaken;
