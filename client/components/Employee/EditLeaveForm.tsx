"use client";
import React, { useEffect, useState } from "react";
import { X, Calendar, MessageSquare } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import RedButton from "../ui/RedButton";
import GetCookie from "@/utils/GetCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface Leave {
  id: string;
  startDate: string;
  endDate: string;
  reason: string;
}

interface EditLeaveFormProps {
  isOpen: boolean;
  onClose: () => void;
  leave: Leave;
}

const EditLeaveForm: React.FC<EditLeaveFormProps> = ({
  isOpen,
  onClose,
  leave,
}) => {
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    reason: "",
  });

  useEffect(() => {
    if (leave) {
      setFormData({
        startDate: leave.startDate.slice(0, 10),
        endDate: leave.endDate.slice(0, 10),
        reason: leave.reason,
      });
    }
  }, [leave]);

  const queryClient = useQueryClient();

  const updateLeaveMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      if (!API_URL) throw new Error("NEXT_PUBLIC_API_URL is not defined.");
      const token = GetCookie();
      const response = await fetch(`${API_URL}/leave/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...data, leaveId: leave.id }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update leave");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success("Leave updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["employeeData"] });
      onClose();
    },
    onError: (error: any) => {
      toast.error(`Update failed: ${error.message}`);
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

    updateLeaveMutation.mutate(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-neutral-900 rounded-md p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-100">Update Leave</h2>
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
              disabled={updateLeaveMutation.isPending}
              className="w-full"
            >
              {updateLeaveMutation.isPending ? "Updating..." : "Update Leave"}
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

export default EditLeaveForm;
