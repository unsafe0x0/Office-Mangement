"use client";
import React, { useState, useEffect } from "react";
import { Bell, MessageSquare, Users, User, Shield } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import RedButton from "../ui/RedButton";
import GetCookie from "@/utils/GetCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface EditNotificationFormProps {
  isOpen: boolean;
  onClose: () => void;
  notification: {
    id: string;
    message: string;
    forWhom: "ALL" | "EMPLOYEE" | "ADMIN";
  } | null;
}

interface NotificationFormData {
  notificationId: string;
  message: string;
  forWhom: "ALL" | "EMPLOYEE" | "ADMIN";
}

const EditNotificationForm: React.FC<EditNotificationFormProps> = ({
  isOpen,
  onClose,
  notification,
}) => {
  const [formData, setFormData] = useState<NotificationFormData>({
    notificationId: "",
    message: "",
    forWhom: "ALL",
  });

  const queryClient = useQueryClient();

  useEffect(() => {
    if (notification) {
      setFormData({
        notificationId: notification.id,
        message: notification.message,
        forWhom: notification.forWhom,
      });
    }
  }, [notification]);

  const updateNotificationMutation = useMutation({
    mutationFn: async (data: NotificationFormData) => {
      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined.");
      }

      const response = await fetch(`${API_URL}/notification/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GetCookie()}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update notification");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Notification updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      handleClose();
    },
    onError: (error) => {
      console.error("Update notification error:", error.message);
      toast.error(`Failed to update notification: ${error.message}`);
    },
  });

  const handleInputChange = (
    field: keyof NotificationFormData,
    value: string,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleClose = () => {
    setFormData({
      notificationId: "",
      message: "",
      forWhom: "ALL",
    });
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateNotificationMutation.mutate(formData);
  };

  if (!isOpen || !notification) return null;

  const targetOptions = [
    {
      value: "ALL",
      label: "All Users",
      icon: Users,
      description: "Send to everyone",
    },
    {
      value: "EMPLOYEE",
      label: "Employees Only",
      icon: User,
      description: "Send to employees only",
    },
    {
      value: "ADMIN",
      label: "Admins Only",
      icon: Shield,
      description: "Send to admins only",
    },
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 h-screen">
      <div className="bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-md p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-neutral-700/50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-100">
            Edit Notification
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <MessageSquare size={18} />
              Message
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 resize-none transition-all duration-200"
              placeholder="Enter notification message"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <Bell size={18} />
              Target Audience
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {targetOptions.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleInputChange("forWhom", option.value)}
                    className={`p-4 rounded-md border transition-all duration-200 focus:outline-none ${
                      formData.forWhom === option.value
                        ? "border-blue-500/50 bg-blue-500/10"
                        : "border-neutral-600/50 bg-neutral-800/70 hover:border-neutral-500/50 hover:bg-neutral-800/90"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <IconComponent
                        size={20}
                        className={`transition-colors duration-200 ${
                          formData.forWhom === option.value
                            ? "text-blue-400"
                            : "text-neutral-400"
                        }`}
                      />
                      <span
                        className={`text-sm font-normal transition-colors duration-200 ${
                          formData.forWhom === option.value
                            ? "text-blue-300"
                            : "text-neutral-300"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span
                        className={`text-sm text-center transition-colors duration-200 ${
                          formData.forWhom === option.value
                            ? "text-blue-400/70"
                            : "text-neutral-400"
                        }`}
                      >
                        {option.description}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bg-neutral-800/30 border border-neutral-600/50 rounded-md p-4">
            <div className="flex items-start gap-3">
              <Bell size={18} className="text-neutral-400 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-normal text-neutral-300 mb-1">
                  Preview
                </h4>
                <p className="text-sm text-neutral-400">
                  {formData.message ||
                    "Your notification message will appear here..."}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-neutral-500">
                  <span>Target:</span>
                  <span className="capitalize">
                    {formData.forWhom.toLowerCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Button
              type="submit"
              className="w-full"
              disabled={updateNotificationMutation.isPending}
            >
              {updateNotificationMutation.isPending
                ? "Updating Notification..."
                : "Update Notification"}
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

export default EditNotificationForm;
