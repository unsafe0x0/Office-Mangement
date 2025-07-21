"use client";
import React, { useState, useEffect } from "react";
import GetCookie from "@/utils/GetCookie";
import { useQuery } from "@tanstack/react-query";
import Sidebar from "./Sidebar";

const fetchAdminData = async () => {
  const response = await fetch("/admin/dashboard", {
    headers: {
      Authorization: `Bearer ${GetCookie()}`,
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  const { totalEmployees, totalTasks, totalPayrolls, totalNotifications } = data;
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <main >
      <Sidebar />
    </main>
  );
};

export default Admin;
