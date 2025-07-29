"use client";
import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import LeaveTable from "./LeaveTable";
import LeaveRequestForm from "./LeaveRequestForm";
import Button from "../ui/Button";

interface Leave {
  id: string;
  reason: string;
  startDate: string;
  endDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
}

interface LeavesProps {
  leaves?: Leave[];
}

const Leaves = ({ leaves = [] }: LeavesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isLeaveRequestFormOpen, setIsLeaveRequestFormOpen] = useState(false);

  const filteredLeaves = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return leaves.filter(
      (leave) =>
        leave.reason.toLowerCase().includes(term) ||
        leave.status.toLowerCase().includes(term),
    );
  }, [leaves, searchTerm]);

  return (
    <div className="flex flex-col justify-start items-start w-full h-full space-y-5">
      <div className="flex justify-between items-center mb-4 w-full">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-100 font-heading mb-2">
            My Leaves
          </h2>
          <p className="text-neutral-400">
            View and manage your leave requests
          </p>
        </div>
        <Button
          onClick={() => setIsLeaveRequestFormOpen(true)}
          icon={<Plus size={16} />}
        >
          Request Leave
        </Button>
      </div>

      <input
        type="text"
        placeholder="Search Leaves..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-5 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200 w-full max-w-2xl"
      />

      <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-6 w-full">
        <LeaveTable leaves={filteredLeaves} />
      </div>

      <LeaveRequestForm
        isOpen={isLeaveRequestFormOpen}
        onClose={() => setIsLeaveRequestFormOpen(false)}
      />
    </div>
  );
};

export default Leaves;
