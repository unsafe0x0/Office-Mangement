"use client";
import React, { useState } from "react";
import {
  Plus,
  Calendar,
  User,
  CheckCircle,
  XCircle,
  Clock,
  Wifi,
} from "lucide-react";
import AddAttendanceForm from "./AddAttendanceForm";
import Button from "../ui/Button";

interface Attendance {
  id: string;
  employeeId: string;
  employeeEmail: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "REMOTE";
  createdAt: string;
  updatedAt: string;
  employee?: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  };
}

interface AttendanceProps {
  attendance: Attendance[];
  employees: Array<{
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
  }>;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "PRESENT":
      return "bg-green-600 text-white";
    case "ABSENT":
      return "bg-red-600 text-white";
    case "HALF_DAY":
      return "bg-yellow-500 text-white";
    case "REMOTE":
      return "bg-blue-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "PRESENT":
      return <CheckCircle size={16} />;
    case "ABSENT":
      return <XCircle size={16} />;
    case "HALF_DAY":
      return <Clock size={16} />;
    case "REMOTE":
      return <Wifi size={16} />;
    default:
      return <Calendar size={16} />;
  }
};

const Attendance = ({ attendance, employees }: AttendanceProps) => {
  const [isAddAttendanceFormOpen, setIsAddAttendanceFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<
    (typeof employees)[0] | null
  >(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString();
  };

  const handleAddAttendance = (employee: (typeof employees)[0]) => {
    setSelectedEmployee(employee);
    setIsAddAttendanceFormOpen(true);
  };

  const groupedAttendance = attendance.reduce(
    (groups, record) => {
      const date = formatDate(record.date);
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(record);
      return groups;
    },
    {} as Record<string, Attendance[]>,
  );

  const sortedDates = Object.keys(groupedAttendance).sort(
    (a, b) => new Date(b).getTime() - new Date(a).getTime(),
  );

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-neutral-100 font-heading">
            Attendance
          </h1>
          <p className="text-neutral-400">
            Track employee attendance and manage records
          </p>
        </div>
        <div className="flex gap-2">
          <select
            onChange={(e) => {
              const employee = employees.find(
                (emp) => emp.id === e.target.value,
              );
              if (employee) {
                handleAddAttendance(employee);
              }
            }}
            className="bg-neutral-800 border border-neutral-700 rounded-md px-3 py-2 text-neutral-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
          >
            <option value="" disabled>
              Select Employee
            </option>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-6">
        {sortedDates.length > 0 ? (
          sortedDates.map((date) => (
            <div
              key={date}
              className="bg-neutral-900 rounded-md overflow-hidden"
            >
              <div className="bg-neutral-800 px-6 py-3 border-b border-neutral-700">
                <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
                  <Calendar size={18} />
                  {date}
                </h3>
                <p className="text-neutral-400 text-sm">
                  {groupedAttendance[date].length} record
                  {groupedAttendance[date].length !== 1 ? "s" : ""}
                </p>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-neutral-300">
                  <thead className="text-sm text-neutral-400 border-b border-neutral-700">
                    <tr>
                      <th className="px-6 py-3">Employee</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3">Time</th>
                      <th className="px-6 py-3">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {groupedAttendance[date].map((record) => (
                      <tr
                        key={record.id}
                        className="border-b border-neutral-700 hover:bg-neutral-800/50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-md overflow-hidden border border-neutral-600">
                              <img
                                src={
                                  record.employee?.profilePicture ||
                                  "/placeholder.jpg"
                                }
                                alt={
                                  record.employee?.name || record.employeeEmail
                                }
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div>
                              <div className="font-normal text-neutral-100">
                                {record.employee?.name || "Unknown Employee"}
                              </div>
                              <div className="text-neutral-400 text-sm">
                                {record.employeeEmail}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <span className="text-neutral-300">
                              {getStatusIcon(record.status)}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-sm font-normal ${getStatusStyle(record.status)}`}
                            >
                              {record.status.replace("_", " ")}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-neutral-300 text-sm">
                            {formatTime(record.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => {
                              const employee = employees.find(
                                (emp) => emp.id === record.employeeId,
                              );
                              if (employee) {
                                handleAddAttendance(employee);
                              }
                            }}
                            className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                          >
                            Add Another
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-neutral-900 rounded-md shadow-lg">
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-md bg-neutral-800 flex items-center justify-center">
                <Calendar size={24} className="text-neutral-400" />
              </div>
              <h3 className="text-lg font-normal text-neutral-300 mb-2">
                No attendance records found
              </h3>
              <p className="text-neutral-400 mb-4">
                Start tracking attendance by adding the first record
              </p>
              <select
                onChange={(e) => {
                  const employee = employees.find(
                    (emp) => emp.id === e.target.value,
                  );
                  if (employee) {
                    handleAddAttendance(employee);
                  }
                }}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md mx-auto block transition-colors"
                defaultValue=""
              >
                <option value="" disabled>
                  Select Employee to Add Attendance
                </option>
                {employees.map((employee) => (
                  <option key={employee.id} value={employee.id}>
                    {employee.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {selectedEmployee && (
        <AddAttendanceForm
          isOpen={isAddAttendanceFormOpen}
          onClose={() => {
            setIsAddAttendanceFormOpen(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
        />
      )}
    </div>
  );
};

export default Attendance;
