"use client";
import React from "react";
import { Calendar, CheckCircle, XCircle, Clock, Wifi } from "lucide-react";

interface Attendance {
  id: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "REMOTE";
  createdAt: string;
  updatedAt: string;
}

interface AttendanceTableProps {
  records: Attendance[];
}

const getStatusBadge = (status: string) => {
  const base =
    "inline-flex items-center gap-1 px-3 py-1 rounded-md text-xs font-medium border";

  switch (status) {
    case "PRESENT":
      return {
        className: `${base} bg-green-500/10 text-green-400 border-green-500/30`,
        icon: <CheckCircle size={14} />,
      };
    case "ABSENT":
      return {
        className: `${base} bg-red-500/10 text-red-400 border-red-500/30`,
        icon: <XCircle size={14} />,
      };
    case "REMOTE":
      return {
        className: `${base} bg-blue-500/10 text-blue-400 border-blue-500/30`,
        icon: <Wifi size={14} />,
      };
    case "HALF_DAY":
      return {
        className: `${base} bg-yellow-500/10 text-yellow-400 border-yellow-500/30`,
        icon: <Clock size={14} />,
      };
    default:
      return {
        className: `${base} bg-gray-500/10 text-gray-400 border-gray-500/30`,
        icon: <Clock size={14} />,
      };
  }
};

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

const formatDateShort = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

const AttendanceTable = ({ records }: AttendanceTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-neutral-300">
        <thead className="text-sm text-neutral-400 border-b border-neutral-700/50">
          <tr>
            <th className="px-6 py-3">Date</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Marked On</th>
            <th className="px-6 py-3">Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {records.map((rec) => {
            const badge = getStatusBadge(rec.status);
            return (
              <tr
                key={rec.id}
                className="border-b border-neutral-800 hover:bg-neutral-800/30 transition-colors"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-neutral-400" />
                    <span className="text-neutral-100">
                      {formatDate(rec.date)}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={badge.className}>
                    {badge.icon}
                    {rec.status.replace("_", " ")}
                  </span>
                </td>
                <td className="px-6 py-4 text-neutral-400">
                  {formatDateShort(rec.createdAt)}
                </td>
                <td className="px-6 py-4 text-neutral-400">
                  {formatDateShort(rec.updatedAt)}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AttendanceTable;
