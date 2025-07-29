"use client";
import React, { useState } from "react";
import { Calendar, CheckCircle, XCircle, Clock, Wifi } from "lucide-react";
import AttendanceTable from "./AttendanceTable";
import SummaryCard from "./SummaryCard";

interface Attendance {
  id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "REMOTE";
  createdAt: string;
  updatedAt: string;
}

interface AttendanceProps {
  attendance?: Attendance[];
}

const Attendance = ({ attendance = [] }: AttendanceProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredAttendance = attendance.filter(
    (a) =>
      a.date.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.status.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const getAttendanceSummary = () => {
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "PRESENT").length;
    const absent = attendance.filter((a) => a.status === "ABSENT").length;
    const remote = attendance.filter((a) => a.status === "REMOTE").length;
    const halfDay = attendance.filter((a) => a.status === "HALF_DAY").length;
    return { total, present, absent, remote, halfDay };
  };

  const summary = getAttendanceSummary();

  return (
    <div className="flex flex-col w-full h-full items-start justify-start space-y-6">
      <div className="flex justify-between items-center mb-4 w-full">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-100 font-heading mb-2">
            My Attendance
          </h2>
          <p className="text-neutral-400">View your attendance records</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
        <SummaryCard
          icon={<Calendar size={20} className="text-blue-400" />}
          label="Total Days"
          value={summary.total}
        />
        <SummaryCard
          icon={<CheckCircle size={20} className="text-green-400" />}
          label="Present"
          value={summary.present}
        />
        <SummaryCard
          icon={<XCircle size={20} className="text-red-400" />}
          label="Absent"
          value={summary.absent}
        />
        <SummaryCard
          icon={<Wifi size={20} className="text-blue-400" />}
          label="Remote"
          value={summary.remote}
        />
        <SummaryCard
          icon={<Clock size={20} className="text-yellow-400" />}
          label="Half Day"
          value={summary.halfDay}
        />
      </div>

      <input
        type="text"
        placeholder="Search Attendance..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-5 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200 w-full max-w-2xl"
      />
      <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-6 w-full">
        {filteredAttendance.length > 0 ? (
          <AttendanceTable records={filteredAttendance} />
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-md bg-neutral-800 flex items-center justify-center">
              <Clock size={24} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-normal text-neutral-300 mb-2">
              No attendance records found
            </h3>
            <p className="text-neutral-400">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Your attendance records will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
