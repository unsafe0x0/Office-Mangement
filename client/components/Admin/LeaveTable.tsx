"use client";
import React, { useState } from "react";
import { MoreVertical, Edit, Trash, Check, X, User } from "lucide-react";

interface Leave {
  employeeName: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
  profilePicture: string;
}

const getStatusStyle = (status: string) => {
  switch (status.toLowerCase()) {
    case "approved":
      return "bg-green-600 text-white";
    case "pending":
      return "bg-yellow-500 text-white";
    case "rejected":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

const LeaveTable = ({ leaves }: { leaves: Leave[] }) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );
  const [leaveData, setLeaveData] = useState<Leave[]>(leaves);

  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleStatusChange = (
    index: number,
    status: "APPROVED" | "REJECTED",
  ) => {
    const updated = [...leaveData];
    updated[index].status = status;
    setLeaveData(updated);
    setOpenDropdownIndex(null);
  };

  const handleEdit = (leave: Leave) => {
    console.log("Edit", leave);
  };

  const handleDelete = (leave: Leave) => {
    console.log("Delete", leave);
  };

  return (
    <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-neutral-300">
          <thead className="text-sm uppercase text-neutral-400 border-b border-neutral-700/50">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Start Date</th>
              <th className="px-6 py-3">End Date</th>
              <th className="px-6 py-3">Reason</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaveData.map((leave, index) => (
              <tr
                key={index}
                className="border-b border-neutral-700/50 hover:bg-neutral-800/70 relative"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={leave.profilePicture}
                    alt={leave.employeeName}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-neutral-100 font-normal">
                    {leave.employeeName}
                  </span>
                </td>
                <td className="px-6 py-4">{leave.startDate}</td>
                <td className="px-6 py-4">{leave.endDate}</td>
                <td className="px-6 py-4">{leave.reason}</td>
                <td className="px-6 py-4">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-normal ${getStatusStyle(leave.status)}`}
                  >
                    {leave.status}
                  </div>
                </td>
                <td className="px-6 py-4 relative text-center align-middle">
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="p-1.5 hover:bg-neutral-700/50 rounded-md transition-all duration-200 cursor-pointer"
                    >
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  {openDropdownIndex === index && (
                    <div className="absolute -left-16 mt-1 bg-neutral-800/90 border border-neutral-600/50 rounded-md z-10 backdrop-blur-sm w-40">
                      <button
                        onClick={() => handleStatusChange(index, "APPROVED")}
                        className="w-full cursor-pointer px-3 py-2 flex items-center gap-2 text-green-400 hover:bg-neutral-700/50 text-sm text-left transition-colors duration-200"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(index, "REJECTED")}
                        className="w-full cursor-pointer px-3 py-2 flex items-center gap-2 text-red-400 hover:bg-neutral-700/50 text-sm text-left transition-colors duration-200"
                      >
                        <X size={14} /> Reject
                      </button>
                      <button
                        onClick={() => handleDelete(leave)}
                        className="w-full cursor-pointer px-3 py-2 flex items-center gap-2 hover:bg-neutral-700/50 text-sm text-red-400 text-left transition-colors duration-200"
                      >
                        <Trash size={14} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {leaveData.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800 flex items-center justify-center">
            <User size={24} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-normal text-neutral-300 mb-2">
            No leave requests found
          </h3>
          <p className="text-neutral-400">
            All employees are currently working
          </p>
        </div>
      )}
    </div>
  );
};

export default LeaveTable;
