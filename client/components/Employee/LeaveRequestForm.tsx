"use client";
import React, { useState } from "react";
import { X, Calendar, MessageSquare } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import RedButton from "../ui/RedButton";
import GetCookie from "@/utils/GetCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface LeaveRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LeaveFormData {
  startDate: string;
  endDate: string;
  reason: string;
}

const LeaveRequestForm: React.FC<LeaveRequestFormProps> = ({
  isOpen,
  onClose,
}) => {
  const [formData, setFormData] = useState<LeaveFormData>({
    startDate: "",
    endDate: "",
    reason: "",
  });

  const queryClient = useQueryClient();

  const requestLeaveMutation = useMutation({
    mutationFn: async (data: LeaveFormData) => {
      if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined.");
      const token = GetCookie();
      const response = await fetch(`${API_URL}/leave/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to request leave");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Leave request submitted successfully!");
      queryClient.invalidateQueries({ queryKey: ["employeeData"] });
      onClose();
      setFormData({ startDate: "", endDate: "", reason: "" });
    },
    onError: (error: any) => {
      toast.error(`Failed to request leave: ${error.message}`);
    },
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      toast.error("Start date cannot be after end date");
      return;
    }

    requestLeaveMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-md p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-100">Request Leave</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <Calendar size={18} />
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              name="endDate"
              value={formData.endDate}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <MessageSquare size={18} />
              Reason
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleInputChange}
              rows={4}
              placeholder="Please provide a reason for your leave request..."
              className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              required
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Button
              type="submit"
              disabled={requestLeaveMutation.isPending}
              className="w-full"
            >
              {requestLeaveMutation.isPending
                ? "Submitting..."
                : "Submit Request"}
            </Button>
            <RedButton type="button" onClick={onClose} className="w-full">
              Cancel
            </RedButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveRequestForm;
