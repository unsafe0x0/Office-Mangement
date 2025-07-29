"use client";

import React, { useEffect, useState } from "react";
import GetCookie from "@/utils/GetCookie";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Leaves from "./Leaves";
import Attendance from "./Attendance";
import Payroll from "./Payroll";
import Notifications from "./Notifications";
import Settings from "./Settings";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchEmployeeData = async () => {
  const token = GetCookie();
  const response = await fetch(`${API_URL}/employee/info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch employee data");
  }
  return response.json();
};

const Employee = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["employeeData"],
    queryFn: fetchEmployeeData,
  });

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [leaves, setLeaves] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const user = data?.employee;

  useEffect(() => {
    if (user) {
      setLeaves(user.leaves || []);
      setAttendance(user.attendance || []);
      setPayrolls(user.payrolls || []);
    }
    if (data?.notifications) {
      setNotifications(data.notifications);
    }
  }, [data, user]);

  if (isLoading) {
    return (
      <div
        role="status"
        className="flex justify-center items-center w-full min-h-screen"
      >
        <svg
          aria-hidden="true"
          className="inline w-12 h-12 animate-spin text-gray-500 fill-blue-500"
          viewBox="0 0 100 101"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.6C100 78.2 77.6 100.6 50 100.6S0 78.2 0 50.6 22.4 0.6 50 0.6 100 22.98 100 50.6Z"
            fill="currentColor"
          />
          <path
            d="M93.97 39.04C96.39 38.4 97.86 35.91 97 33.55C95.29 28.82 92.87 24.37 89.81 20.35..."
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        Error: {error?.message || "User data not available"}
      </div>
    );
  }

  const sidebarUser = {
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture || "/placeholder.jpg",
    role: user.role,
  };

  const totalLeaves = leaves.length;
  const totalAttendance = attendance.length;
  const totalNotifications = notifications.length;
  const totalPayrolls = payrolls.length;

  return (
    <main className="flex flex-col lg:flex-row h-screen fixed w-full">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={sidebarUser}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <section className="flex-1 p-4 overflow-y-scroll w-full">
        {activeTab === "Dashboard" && (
          <Dashboard
            totalLeaves={totalLeaves}
            totalAttendance={totalAttendance}
            totalNotifications={totalNotifications}
            totalPayrolls={totalPayrolls}
            recentLeaves={leaves.slice(0, 5)}
            recentAttendance={attendance.slice(0, 5)}
            recentNotifications={notifications.slice(0, 6)}
            setActiveTab={setActiveTab}
          />
        )}
        {activeTab === "Leaves" && <Leaves leaves={leaves} />}
        {activeTab === "Attendance" && <Attendance attendance={attendance} />}
        {activeTab === "Payroll" && <Payroll payrolls={payrolls} />}
        {activeTab === "Notifications" && (
          <Notifications notifications={notifications} />
        )}
        {activeTab === "Settings" && <Settings employee={user} />}
      </section>
    </main>
  );
};

export default Employee;
