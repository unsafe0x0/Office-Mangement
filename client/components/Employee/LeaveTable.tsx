"use client";
import React, { useState } from "react";
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreVertical,
  Edit,
  Trash,
} from "lucide-react";
import EditLeaveForm from "./EditLeaveForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import GetCookie from "@/utils/GetCookie";

interface Leave {
  id: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface LeaveTableProps {
  leaves: Leave[];
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "APPROVED":
      return <CheckCircle size={14} className="text-green-400" />;
    case "REJECTED":
      return <XCircle size={14} className="text-red-400" />;
    case "PENDING":
      return <AlertCircle size={14} className="text-yellow-400" />;
    default:
      return <Clock size={14} className="text-gray-400" />;
  }
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-500/20 text-green-400 border-green-500/30";
    case "REJECTED":
      return "bg-red-500/20 text-red-400 border-red-500/30";
    case "PENDING":
      return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
    default:
      return "bg-gray-500/20 text-gray-400 border-gray-500/30";
  }
};

const calculateDuration = (startDate: string, endDate: string) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  return diffDays === 1 ? "1 day" : `${diffDays} days`;
};

const LeaveTable: React.FC<LeaveTableProps> = ({ leaves }) => {
  const queryClient = useQueryClient();
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const deleteLeaveMutation = useMutation({
    mutationFn: async (leaveId: string) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${API_URL}/leave/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GetCookie()}`,
        },
        body: JSON.stringify({ leaveId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to delete leave");
      }
    },
    onSuccess: () => {
      toast.success("Leave deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
    },
    onError: (err: any) => {
      toast.error(err.message || "Failed to delete leave");
    },
  });

  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleEdit = (leave: Leave) => {
    setSelectedLeave(leave);
    setIsEditOpen(true);
    setOpenDropdownIndex(null);
  };

  const handleDelete = (leave: Leave) => {
    deleteLeaveMutation.mutate(leave.id);
    setOpenDropdownIndex(null);
  };

  if (leaves.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-md bg-neutral-800 flex items-center justify-center">
          <Calendar size={24} className="text-neutral-400" />
        </div>
        <h3 className="text-lg font-normal text-neutral-300 mb-2">
          No leave requests found
        </h3>
        <p className="text-neutral-400">Your leave requests will appear here</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-neutral-700/50">
              <th className="px-4 py-4 text-sm text-neutral-300 font-medium text-left">
                Reason
              </th>
              <th className="px-4 py-4 text-sm text-neutral-300 font-medium text-left">
                Duration
              </th>
              <th className="px-4 py-4 text-sm text-neutral-300 font-medium text-left">
                Start Date
              </th>
              <th className="px-4 py-4 text-sm text-neutral-300 font-medium text-left">
                End Date
              </th>
              <th className="px-4 py-4 text-sm text-neutral-300 font-medium text-left">
                Status
              </th>
              <th className="px-4 py-4 text-sm text-neutral-300 font-medium text-left">
                Applied On
              </th>
              <th className="px-4 py-4 text-sm text-neutral-300 font-medium text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {leaves.map((leave, index) => (
              <tr
                key={leave.id}
                className="border-b border-neutral-800/50 hover:bg-neutral-800/30 relative"
              >
                <td className="px-4 py-4 max-w-xs truncate">{leave.reason}</td>
                <td className="px-4 py-4 flex items-center gap-2 text-sm text-neutral-300">
                  <Clock size={14} className="text-neutral-400" />
                  {calculateDuration(leave.startDate, leave.endDate)}
                </td>
                <td className="px-4 py-4">
                  {new Date(leave.startDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-4">
                  {new Date(leave.endDate).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-4">
                  <span
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${getStatusStyle(leave.status)}`}
                  >
                    {getStatusIcon(leave.status)}
                    {leave.status}
                  </span>
                </td>
                <td className="px-4 py-4">
                  {new Date(leave.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td className="px-4 py-4 text-center relative">
                  <div className="relative inline-block">
                    <button
                      onClick={() => toggleDropdown(index)}
                      className="p-1.5 hover:bg-neutral-700/50 rounded-md transition-all cursor-pointer"
                    >
                      <MoreVertical size={16} />
                    </button>
                    {openDropdownIndex === index && (
                      <div className="absolute -left-10 mt-1 bg-neutral-800/90 border border-neutral-600/50 rounded-md z-10 backdrop-blur-sm">
                        <button
                          onClick={() => handleEdit(leave)}
                          className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700/50 text-sm cursor-pointer"
                        >
                          <Edit size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(leave)}
                          className="w-full px-3 py-2 flex items-center gap-2 text-red-400 hover:bg-neutral-700/50 text-sm cursor-pointer"
                        >
                          <Trash size={14} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedLeave && (
        <EditLeaveForm
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedLeave(null);
          }}
          leave={selectedLeave}
        />
      )}
    </>
  );
};

export default LeaveTable;
