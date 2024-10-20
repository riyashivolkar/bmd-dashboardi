"use client";

import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Function to toggle the theme
  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
    const body = document.body;
    body.classList.toggle("light");

    // Save the user's preference in local storage
    if (body.classList.contains("light")) {
      localStorage.setItem("theme", "light");
    } else {
      localStorage.removeItem("theme");
    }
  };

  // On page load, check for saved theme
  useEffect(() => {
    if (localStorage.getItem("theme") === "light") {
      document.body.classList.add("light");
      setIsDarkMode(true);
    }
  }, []);

  return (
    <div className="flex flex-col items-center mt-10">
      {/* Toggler */}
      <div
        className={`bg-gray-500 w-20 cursor-pointer rounded-3xl transition-colors ${
          isDarkMode ? "dark:bg-green-500" : ""
        }`}
        onClick={toggleTheme}
      >
        <div
          className={`bg-white w-10 h-10 scale-75 rounded-3xl transition-transform ${
            isDarkMode ? "translate-x-10 dark:bg-black" : ""
          }`}
        ></div>
      </div>
    </div>
  );
};

export default ThemeToggle;
