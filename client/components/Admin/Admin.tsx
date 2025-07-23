"use client";

import React, { useState } from "react";
import GetCookie from "@/utils/GetCookie";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "./Sidebar";
import Dashboard from "./Dashboard";
import Employees from "./Employees";
import Leaves from "./Leaves";
import Notifications from "./Notifications";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const fetchAdminData = async () => {
  const token = GetCookie();
  const response = await fetch(`${API_URL}/admin/dashboard`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch admin data");
  }
  return response.json();
};

const Admin = () => {
  const { data, error, isLoading } = useQuery({
    queryKey: ["adminData"],
    queryFn: fetchAdminData,
  });

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
            fill="currentColor"
          />
          <path
            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
            fill="currentFill"
          />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center w-full min-h-screen">
        Error: {error.message}
      </div>
    );
  }

  const user = data.data.admin;
  const totalEmployees = data.data.employees?.length || 0;
  const totalLeaves = data.data.leaves?.length || 0;
  const totalTasks = data.data.tasks?.length || 0;
  const totalNotifications = data.data.notifications?.length || 0;

  const employees = [
    {
      name: "John Doe",
      position: "Software Engineer",
      department: "Engineering",
      email: "john.doe@example.com",
      profilePictureUrl: "/placeholder.png",
      joinDate: "2023-01-15",
      isActive: true
    },
    {
      name: "Jane Smith",
      position: "Product Manager",
      department: "Product",
      email: "jane.smith@example.com",
      profilePictureUrl: "/placeholder.png",
      joinDate: "2023-02-20",
      isActive: true
    },
    {
      name: "Mike Johnson",
      position: "UX Designer",
      department: "Design",
      email: "mike.johnson@example.com",
      profilePictureUrl: "/placeholder.png",
      joinDate: "2023-01-15",
      isActive: false
    },
    {
      name: "Emily Brown",
      position: "HR Specialist",
      department: "Human Resources",
      email: "emily.brown@example.com",
      profilePictureUrl: "/placeholder.png",
      joinDate: "2023-03-10",
      isActive: true
    },
    {
      name: "Chris Lee",
      position: "QA Engineer",
      department: "Quality Assurance",
      email: "chris.lee@example.com",
      profilePictureUrl: "/placeholder.png",
      joinDate: "2023-04-05",
      isActive: true
    },
    {
      name: "Sara Wilson",
      position: "Marketing Coordinator",
      department: "Marketing",
      email: "sara.wilson@example.com",
      profilePictureUrl: "/placeholder.png",
      joinDate: "2023-05-12",
      isActive: false
    }
  ];

  const leaves = [
    {
      employeeName: "John Doe",
      profilePictureUrl: "/placeholder.png",
      startDate: "2023-10-01",
      endDate: "2023-10-05",
      reason: "Medical Leave",
      status: "Approved"
    },
    {
      employeeName: "Jane Smith",
      profilePictureUrl: "/placeholder.png",
      startDate: "2023-10-10",
      endDate: "2023-10-12",
      reason: "Vacation",
      status: "Pending"
    },
    {
      employeeName: "Mike Johnson",
      profilePictureUrl: "/placeholder.png",
      startDate: "2023-09-20",
      endDate: "2023-09-22",
      reason: "Personal Work",
      status: "Rejected"
    },
    {
      employeeName: "Emily Brown",
      profilePictureUrl: "/placeholder.png",
      startDate: "2023-11-01",
      endDate: "2023-11-03",
      reason: "Conference",
      status: "Approved"
    },
    {
      employeeName: "Chris Lee",
      profilePictureUrl: "/placeholder.png",
      startDate: "2023-12-15",
      endDate: "2023-12-20",
      reason: "Family Event",
      status: "Pending"
    },
  ];

  const notifications = [
    {
      message: "Server maintenance scheduled for tonight.",
      forWhom: "All Employees",
      createdAt: "2023-10-01T12:00:00Z"
    },
    {
      message: "New policy update available in the portal.",
      forWhom: "HR Team",
      createdAt: "2023-10-02T09:00:00Z"
    },
    {
      message: "Quarterly meeting on Friday at 3 PM.",
      forWhom: "All Employees",
      createdAt: "2023-10-03T15:30:00Z"
    },
    {
      message: "Submit your timesheets by end of day.",
      forWhom: "Engineering",
      createdAt: "2023-10-04T10:15:00Z"
    },
    {
      message: "Welcome our new team member, Alex Kim!",
      forWhom: "Product",
      createdAt: "2023-10-05T08:45:00Z"
    }
  ];

  return (
    <main className="flex flex-col md:flex-row h-screen fixed w-full">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        open={sidebarOpen}
        setOpen={setSidebarOpen}
      />
      <section className="flex-1 p-4 overflow-y-scroll w-full">
        {activeTab === "Dashboard" && <Dashboard totalEmployees={totalEmployees} totalLeaves={totalLeaves} totalTasks={totalTasks} totalNotifications={totalNotifications}
          employees={employees} leaves={leaves} notifications={notifications} />}
        {activeTab === "Employees" && <Employees employees={employees} />}
        {activeTab === "Leaves" && <Leaves leaves={leaves} />}
        {activeTab === "Notifications" && <Notifications notifications={notifications} />}
      </section>
    </main>
  );
};

export default Admin;
