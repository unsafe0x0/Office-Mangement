"use client";
import React, { useState, useEffect } from "react";
import {
  FileText,
  Calendar,
  Users,
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  ChevronDown,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import RedButton from "../ui/RedButton";
import GetCookie from "@/utils/GetCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Task {
  id: string;
  title: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  dueDate?: string;
  employeeIds: string[];
  createdAt: string;
  updatedAt: string;
}

interface EditTaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  employees: Array<{
    id: string;
    name: string;
    email: string;
  }>;
}

interface TaskFormData {
  taskId: string;
  title: string;
  description: string;
  dueDate: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  employeeIds: string[];
}

const EditTaskForm: React.FC<EditTaskFormProps> = ({
  isOpen,
  onClose,
  task,
  employees,
}) => {
  const [formData, setFormData] = useState<TaskFormData>({
    taskId: task.id,
    title: "",
    description: "",
    dueDate: "",
    status: "PENDING",
    employeeIds: [],
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (task) {
      setFormData({
        taskId: task.id,
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate ? task.dueDate.slice(0, 16) : "",
        status: task.status,
        employeeIds: task.employeeIds,
      });
    }
  }, [task]);

  const updateTaskMutation = useMutation({
    mutationFn: async (data: TaskFormData) => {
      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined.");
      }

      const response = await fetch(`${API_URL}/task/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GetCookie()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update task");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Task updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      handleClose();
    },
    onError: (error) => {
      console.error("Update task error:", error.message);
      toast.error(`Failed to update task: ${error.message}`);
    },
  });

  const handleInputChange = (
    field: keyof TaskFormData,
    value: string | string[],
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmployeeToggle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      employeeIds: prev.employeeIds.includes(id)
        ? prev.employeeIds.filter((e) => e !== id)
        : [...prev.employeeIds, id],
    }));
  };

  const handleClose = () => {
    setFormData({
      taskId: "",
      title: "",
      description: "",
      dueDate: "",
      status: "PENDING",
      employeeIds: [],
    });
    setSearchTerm("");
    setIsStatusDropdownOpen(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateTaskMutation.mutate(formData);
  };

  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isOpen) return null;

  const statusOptions = [
    {
      value: "PENDING",
      label: "Pending",
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      value: "IN_PROGRESS",
      label: "In Progress",
      icon: AlertCircle,
      color: "text-blue-500",
    },
    {
      value: "COMPLETED",
      label: "Completed",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      value: "CANCELLED",
      label: "Cancelled",
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  const selectedStatus = statusOptions.find(
    (option) => option.value === formData.status,
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-md p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-neutral-700/50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-100">Edit Task</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <FileText size={18} />
              Task Title
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200"
              placeholder="Enter task title"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <FileText size={18} />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 resize-none transition-all duration-200"
              placeholder="Enter task description"
              rows={4}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                <Calendar size={18} />
                Due Date
              </label>
              <input
                type="datetime-local"
                value={formData.dueDate}
                onChange={(e) => handleInputChange("dueDate", e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200"
              />
            </div>
            <div className="relative">
              <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                <AlertCircle size={18} />
                Status
              </label>
              <button
                type="button"
                onClick={() => setIsStatusDropdownOpen(!isStatusDropdownOpen)}
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 flex items-center justify-between focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200"
              >
                <div className="flex items-center gap-2">
                  {selectedStatus && (
                    <>
                      <selectedStatus.icon
                        size={16}
                        className={selectedStatus.color}
                      />
                      <span>{selectedStatus.label}</span>
                    </>
                  )}
                </div>
                <ChevronDown size={16} className="text-neutral-400" />
              </button>
              {isStatusDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800/90 border border-neutral-600/50 rounded-md z-10 backdrop-blur-sm">
                  {statusOptions.map((option) => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          handleInputChange(
                            "status",
                            option.value as TaskFormData["status"],
                          );
                          setIsStatusDropdownOpen(false);
                        }}
                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700/50 text-sm cursor-pointer text-left transition-colors duration-200"
                      >
                        <IconComponent size={16} className={option.color} />
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <Users size={18} />
              Assign Employees
            </label>

            <div className="mb-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search employees..."
                  className="w-full pl-10 pr-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200"
                />
              </div>
            </div>

            <div className="max-h-40 overflow-y-auto bg-neutral-800/30 border border-neutral-600/50 rounded-md p-3">
              {filteredEmployees.length > 0 ? (
                filteredEmployees.map((employee) => (
                  <label
                    key={employee.id}
                    className="flex items-center gap-3 p-2 hover:bg-neutral-700/50 rounded-md cursor-pointer transition-colors duration-200"
                  >
                    <input
                      type="checkbox"
                      checked={formData.employeeIds.includes(employee.id)}
                      onChange={() => handleEmployeeToggle(employee.id)}
                      className="w-4 h-4 text-blue-500 bg-neutral-700 border-neutral-600 rounded focus:ring-blue-500/50"
                    />
                    <span className="text-neutral-300 text-sm">
                      {employee.name} ({employee.email})
                    </span>
                  </label>
                ))
              ) : (
                <div className="text-center py-4 text-neutral-400 text-sm">
                  No employees found matching your search.
                </div>
              )}
            </div>

            {formData.employeeIds.length > 0 && (
              <div className="mt-3">
                <p className="text-sm text-neutral-400 mb-2">
                  Selected employees:
                </p>
                <div className="flex flex-wrap gap-2">
                  {formData.employeeIds.map((id, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded-md text-sm border border-blue-500/30"
                    >
                      {employees.find((emp) => emp.id === id)?.name ||
                        "Unknown Employee"}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={updateTaskMutation.isPending}
            >
              {updateTaskMutation.isPending
                ? "Updating Task..."
                : "Update Task"}
            </Button>
            <RedButton type="button" onClick={handleClose} className="w-full">
              Cancel
            </RedButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskForm;
