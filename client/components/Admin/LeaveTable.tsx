"use client";
import React, { useState } from "react";
import { MoreVertical, Edit, Trash, Check, X, User } from "lucide-react";
import GetCookie from "@/utils/GetCookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface Leave {
  id: string;
  employee: {
    name: string;
    profilePicture: string;
  };
  startDate: string;
  endDate: string;
  reason: string;
  status: string;
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

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "Invalid date";
  }
};

const calculateDuration = (start: string, end: string) => {
  try {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const msInDay = 1000 * 60 * 60 * 24;
    const diff =
      Math.round((endDate.getTime() - startDate.getTime()) / msInDay) + 1;
    return diff > 0 ? `${diff} day${diff > 1 ? "s" : ""}` : "Invalid";
  } catch {
    return "Invalid";
  }
};

const LeaveTable = ({ leaves }: { leaves: Leave[] }) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );
  const queryClient = useQueryClient();

  const updateMutation = useMutation({
    mutationFn: async ({
      leaveId,
      leaveStatus,
    }: {
      leaveId: string;
      leaveStatus: string;
    }) => {
      const token = GetCookie();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/leave/update`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ leaveId, leaveStatus }),
        },
      );
      if (!res.ok) throw new Error("Failed to update leave");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Leave status updated");
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
    onError: () => {
      toast.error("Failed to update leave status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (leaveId: string) => {
      const token = GetCookie();
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/leave/delete`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ leaveId }),
        },
      );
      if (!res.ok) throw new Error("Failed to delete leave");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Leave deleted");
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
    onError: () => {
      toast.error("Failed to delete leave");
    },
  });

  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleStatusChange = (
    leaveId: string,
    leaveStatus: "APPROVED" | "REJECTED",
  ) => {
    updateMutation.mutate({ leaveId, leaveStatus });
    setOpenDropdownIndex(null);
  };

  const handleDelete = (leaveId: string) => {
    deleteMutation.mutate(leaveId);
  };

  return (
    <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-neutral-300">
          <thead className="text-sm text-neutral-400 border-b border-neutral-700/50">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Start Date</th>
              <th className="px-6 py-3">End Date</th>
              <th className="px-6 py-3">Duration</th>
              <th className="px-6 py-3">Reason</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave, index) => (
              <tr
                key={leave.id}
                className="border-b border-neutral-700/50 hover:bg-neutral-800/70 relative"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={leave.employee?.profilePicture || "/placeholder.jpg"}
                    alt={leave.employee?.name || "Employee"}
                    className="w-8 h-8 rounded-md object-cover"
                  />
                  <span className="text-neutral-100 font-normal">
                    {leave.employee?.name || "Unknown"}
                  </span>
                </td>
                <td className="px-6 py-4">{formatDate(leave.startDate)}</td>
                <td className="px-6 py-4">{formatDate(leave.endDate)}</td>
                <td className="px-6 py-4">
                  {calculateDuration(leave.startDate, leave.endDate)}
                </td>
                <td className="px-6 py-4">{leave.reason}</td>
                <td className="px-6 py-4">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-normal ${getStatusStyle(
                      leave.status,
                    )}`}
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
                        onClick={() => handleStatusChange(leave.id, "APPROVED")}
                        className="w-full cursor-pointer px-3 py-2 flex items-center gap-2 text-green-400 hover:bg-neutral-700/50 text-sm text-left transition-colors duration-200"
                      >
                        <Check size={14} /> Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(leave.id, "REJECTED")}
                        className="w-full cursor-pointer px-3 py-2 flex items-center gap-2 text-red-400 hover:bg-neutral-700/50 text-sm text-left transition-colors duration-200"
                      >
                        <X size={14} /> Reject
                      </button>
                      <button
                        onClick={() => handleDelete(leave.id)}
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

      {leaves.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-md bg-neutral-800 flex items-center justify-center">
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
