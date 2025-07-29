"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  FileText,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import RedButton from "../ui/RedButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface EditLeaveFormProps {
  isOpen: boolean;
  onClose: () => void;
  leave: {
    id: string;
    employeeId: string;
    employeeEmail: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
  };
  employee: {
    id: string;
    name: string;
    email: string;
    position?: string;
    department?: string;
    profilePicture?: string;
  };
}

interface EditLeaveFormData {
  leaveId: string;
  employeeId: string;
  employeeEmail: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
}

const EditLeaveForm: React.FC<EditLeaveFormProps> = ({
  isOpen,
  onClose,
  leave,
  employee,
}) => {
  const [formData, setFormData] = useState<EditLeaveFormData>({
    leaveId: leave.id,
    employeeId: leave.employeeId,
    employeeEmail: leave.employeeEmail,
    startDate: leave.startDate,
    endDate: leave.endDate,
    reason: leave.reason,
    status: leave.status,
  });

  const queryClient = useQueryClient();

  const updateLeaveMutation = useMutation({
    mutationFn: async (data: EditLeaveFormData) => {
      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined.");
      }

      const response = await fetch(`${API_URL}/leave/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update leave");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Leave updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["leaves"] });
      handleClose();
    },
    onError: (error) => {
      console.error("Update leave error:", error.message);
      toast.error(`Failed to update leave: ${error.message}`);
    },
  });

  const handleInputChange = (field: keyof EditLeaveFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setFormData({
      leaveId: leave.id,
      employeeId: leave.employeeId,
      employeeEmail: leave.employeeEmail,
      startDate: leave.startDate,
      endDate: leave.endDate,
      reason: leave.reason,
      status: leave.status,
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateLeaveMutation.mutate(formData);
  };

  // Update form data when leave prop changes
  useEffect(() => {
    if (leave) {
      setFormData({
        leaveId: leave.id,
        employeeId: leave.employeeId,
        employeeEmail: leave.employeeEmail,
        startDate: leave.startDate,
        endDate: leave.endDate,
        reason: leave.reason,
        status: leave.status,
      });
    }
  }, [leave]);

  if (!isOpen) return null;

  const statusOptions = [
    {
      value: "PENDING",
      label: "Pending",
      icon: Clock,
      color: "text-yellow-500",
    },
    {
      value: "APPROVED",
      label: "Approved",
      icon: CheckCircle,
      color: "text-green-500",
    },
    {
      value: "REJECTED",
      label: "Rejected",
      icon: XCircle,
      color: "text-red-500",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 rounded-md p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-100">
            Edit Leave Request
          </h2>
        </div>

        <div className="bg-neutral-800/50 border border-neutral-700 rounded-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-neutral-600">
              <img
                src={employee.profilePicture || "/placeholder.jpg"}
                alt={employee.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-100">
                {employee.name}
              </h3>
              <p className="text-neutral-400 text-sm">{employee.email}</p>
              <div className="flex gap-4 mt-1">
                <span className="text-neutral-300 text-sm">
                  {employee.position}
                </span>
                <span className="text-neutral-300 text-sm">
                  {employee.department}
                </span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                <Calendar size={18} />
                Start Date
              </label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                <Calendar size={18} />
                End Date
              </label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <FileText size={18} />
              Reason
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => handleInputChange("reason", e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Enter leave reason"
              rows={3}
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <CheckCircle size={18} />
              Status
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {statusOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange("status", option.value)}
                    className={`p-4 rounded border transition-all ${
                      formData.status === option.value
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-neutral-700 bg-neutral-800/70 hover:border-neutral-600"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <IconComponent size={20} className={option.color} />
                      <span className="text-sm font-normal text-neutral-300">
                        {option.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={updateLeaveMutation.isPending}
            >
              {updateLeaveMutation.isPending
                ? "Updating Leave..."
                : "Update Leave"}
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

export default EditLeaveForm;
