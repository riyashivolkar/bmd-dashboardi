"use client";

import { useState, useEffect } from "react";
import AdminDashboard from "./components/adminComponents/AdminDashboard";
import EmployeeDashboard from "./components/employeeComponents/EmployeeDashboard";
import Login from "./components/Login";
import { useAuth } from "./utils/context/AuthContext";

export default function Home() {
  const { user, login } = useAuth();
  const [role, setRole] = useState(null);

  useEffect(() => {
    if (user) {
      if (user.email === "riyashivolkar2@gmail.com") {
        setRole("admin");
      } else {
        setRole("employee");
      }
    }
  }, [user]);

  if (!user) {
    return <Login />;
  }

  return (
    <div className="">
      {role === "admin" && <AdminDashboard />}
      {role === "employee" && <EmployeeDashboard />}
    </div>
  );
}
