"use client";

import React, { useState } from "react";
import GetCookie from "@/utils/GetCookie";
import { useQuery } from "@tanstack/react-query";

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

  if (isLoading) {
    return (
      <div role="status" className="flex justify-center items-center w-full min-h-screen">
        <svg aria-hidden="true" className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.864 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7992 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Employee Dashboard</h1>
      <div className="bg-white rounded-lg shadow p-6">
        <p><strong>Name:</strong> {data?.name}</p>
        <p><strong>Email:</strong> {data?.email}</p>
        {/* Add more employee info and dashboard features here */}
      </div>
    </div>
  );
};

export default Employee;
