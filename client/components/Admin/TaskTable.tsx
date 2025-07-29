"use client";
import React, { useState } from "react";
import {
  FileText,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Clock,
  XCircle,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  dueDate?: string;
  employeeEmails: string[];
  createdAt: string;
  updatedAt: string;
}

interface TaskTableProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

const getStatusStyle = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-600 text-white";
    case "IN_PROGRESS":
      return "bg-blue-600 text-white";
    case "PENDING":
      return "bg-yellow-500 text-white";
    case "CANCELLED":
      return "bg-red-600 text-white";
    default:
      return "bg-gray-600 text-white";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return <CheckCircle size={16} className="text-white" />;
    case "IN_PROGRESS":
      return <AlertCircle size={16} className="text-white" />;
    case "PENDING":
      return <Clock size={16} className="text-white" />;
    case "CANCELLED":
      return <XCircle size={16} className="text-white" />;
    default:
      return <FileText size={16} className="text-white" />;
  }
};

const TaskTable = ({ tasks, onEdit, onDelete }: TaskTableProps) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString();

  const formatDateTime = (dateString: string) =>
    new Date(dateString).toLocaleString();

  return (
    <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-neutral-300">
          <thead className="text-sm text-neutral-400 border-b border-neutral-700/50">
            <tr>
              <th className="px-6 py-3">Task</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Due Date</th>
              <th className="px-6 py-3">Assigned To</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map((task, index) => (
              <tr
                key={task.id}
                className="border-b border-neutral-700/50 hover:bg-neutral-800/50 relative"
              >
                <td className="px-6 py-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-neutral-800 flex items-center justify-center text-neutral-400">
                      <FileText size={16} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-normal text-neutral-100">
                        {task.title}
                      </h3>
                      {task.description && (
                        <p className="text-neutral-400 text-sm mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-normal ${getStatusStyle(task.status)}`}
                  >
                    {getStatusIcon(task.status)}
                    {task.status.replace("_", " ")}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {task.dueDate ? (
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-neutral-400" />
                      <span className="text-neutral-300">
                        {formatDate(task.dueDate)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-neutral-500 text-sm">
                      No due date
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Users size={14} className="text-neutral-400" />
                    <span className="text-neutral-300 text-sm">
                      {task.employeeEmails.length} employee
                      {task.employeeEmails.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-neutral-400">
                  {formatDateTime(task.createdAt)}
                </td>
                <td className="px-6 py-4 relative text-center align-middle">
                  <div className="flex justify-center items-center">
                    <button
                      onClick={() =>
                        setOpenDropdownIndex(
                          openDropdownIndex === index ? null : index,
                        )
                      }
                      className="p-1.5 hover:bg-neutral-700/50 rounded-md cursor-pointer transition-all duration-200"
                    >
                      <MoreVertical size={16} className="text-neutral-300" />
                    </button>
                  </div>
                  {openDropdownIndex === index && (
                    <div className="absolute -left-10 mt-1 bg-neutral-800/90 border border-neutral-600/50 rounded-md z-10 backdrop-blur-sm">
                      <button
                        onClick={() => {
                          setOpenDropdownIndex(null);
                          onEdit(task);
                        }}
                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700/50 text-sm cursor-pointer text-left transition-colors duration-200"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => {
                          setOpenDropdownIndex(null);
                          onDelete(task);
                        }}
                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700/50 text-sm text-red-400 cursor-pointer text-left transition-colors duration-200"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-md bg-neutral-800 flex items-center justify-center">
            <FileText size={24} className="text-neutral-400" />
          </div>
          <h3 className="text-lg font-normal text-neutral-300 mb-2">
            No tasks found
          </h3>
          <p className="text-neutral-400">
            Try adjusting your filters or create a new task
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskTable;
