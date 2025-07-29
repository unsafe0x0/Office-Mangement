"use client";
import React, { useState, useEffect } from "react";
import { CheckCircle, XCircle, Clock, Wifi } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import RedButton from "../ui/RedButton";
import GetCookie from "@/utils/GetCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AddAttendanceFormProps {
  isOpen: boolean;
  onClose: () => void;
  employee: {
    id: string;
    name: string;
    email: string;
    position?: string;
    department?: string;
    profilePicture?: string;
  };
}

interface AttendanceFormData {
  employeeId: string;
  employeeEmail: string;
  date: string;
  status: "PRESENT" | "ABSENT" | "HALF_DAY" | "REMOTE";
}

const AddAttendanceForm: React.FC<AddAttendanceFormProps> = ({
  isOpen,
  onClose,
  employee,
}) => {
  const [formData, setFormData] = useState<AttendanceFormData>({
    employeeId: employee.id,
    employeeEmail: employee.email,
    date: "",
    status: "PRESENT",
  });

  const queryClient = useQueryClient();

  const addAttendanceMutation = useMutation({
    mutationFn: async (data: AttendanceFormData) => {
      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined.");
      }

      const response = await fetch(`${API_URL}/attendance/mark`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GetCookie()}`,
        },
        body: JSON.stringify({
          employeeId: data.employeeId,
          date: data.date,
          status: data.status,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add attendance");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Attendance marked successfully!");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
      handleClose();
    },
    onError: (error) => {
      console.error("Add attendance error:", error.message);
      toast.error(`Failed to mark attendance: ${error.message}`);
    },
  });

  const handleInputChange = (
    field: keyof AttendanceFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setFormData({
      employeeId: employee.id,
      employeeEmail: employee.email,
      date: "",
      status: "PRESENT",
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAttendanceMutation.mutate(formData);
  };

  useEffect(() => {
    if (isOpen && !formData.date) {
      const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, date: today }));
    }
  }, [isOpen, formData.date]);

  if (!isOpen) return null;

  const statusOptions = [
    {
      value: "PRESENT",
      label: "Present",
      icon: CheckCircle,
      color: "text-green-500",
    },
    { value: "ABSENT", label: "Absent", icon: XCircle, color: "text-red-500" },
    {
      value: "HALF_DAY",
      label: "Half Day",
      icon: Clock,
      color: "text-yellow-500",
    },
    { value: "REMOTE", label: "Remote", icon: Wifi, color: "text-blue-500" },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-neutral-900 rounded-md p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-100">
            Mark Attendance
          </h2>
        </div>

        <div className="bg-neutral-800/50 border border-neutral-700 rounded-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-md overflow-hidden border border-neutral-600">
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
          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <CheckCircle size={18} />
              Attendance Status
            </label>
            <div className="grid grid-cols-2 gap-3">
              {statusOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange("status", option.value)}
                    className={`p-3 rounded border transition-all ${
                      formData.status === option.value
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-neutral-700 bg-neutral-800/70 hover:border-neutral-600"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <IconComponent size={20} className={option.color} />
                      <span className="text-sm text-neutral-300">
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
              disabled={addAttendanceMutation.isPending}
              className="w-full"
            >
              {addAttendanceMutation.isPending
                ? "Marking Attendance..."
                : "Mark"}
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

export default AddAttendanceForm;
