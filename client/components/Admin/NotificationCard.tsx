"use client";
import React, { useState } from "react";
import {
  Bell,
  User,
  CalendarClock,
  Edit,
  Trash2,
  MoreVertical,
} from "lucide-react";
import EditNotificationForm from "./EditNotificationForm";
import GetCookie from "@/utils/GetCookie";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

interface NotificationCardProps {
  id: string;
  message: string;
  forWhom: string;
  createdAt: string;
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("default", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const getTargetIcon = (forWhom: string) => {
  switch (forWhom.toUpperCase()) {
    case "ALL":
      return <User size={14} className="text-blue-400" />;
    case "EMPLOYEE":
      return <User size={14} className="text-green-400" />;
    case "ADMIN":
      return <User size={14} className="text-purple-400" />;
    default:
      return <User size={14} className="text-neutral-400" />;
  }
};

const getTargetBadgeStyle = (forWhom: string) => {
  switch (forWhom.toUpperCase()) {
    case "ALL":
      return "bg-blue-500/20 text-blue-300 border-blue-500/30";
    case "EMPLOYEE":
      return "bg-green-500/20 text-green-300 border-green-500/30";
    case "ADMIN":
      return "bg-purple-500/20 text-purple-300 border-purple-500/30";
    default:
      return "bg-neutral-500/20 text-neutral-300 border-neutral-500/30";
  }
};

const NotificationCard = ({
  id,
  message,
  forWhom,
  createdAt,
}: NotificationCardProps) => {
  const queryClient = useQueryClient();
  const formattedDate = formatDate(createdAt);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isEditNotificationFormOpen, setIsEditNotificationFormOpen] =
    useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined.");
      }

      const response = await fetch(`${API_URL}/notification/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GetCookie()}`,
        },
        body: JSON.stringify({ notificationId: id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete notification");
      }
    },
    onSuccess: () => {
      toast.success("Notification deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete notification");
    },
  });

  return (
    <div className="relative bg-neutral-800/50 border border-neutral-700 rounded-md p-6 hover:bg-neutral-800/70 transition-colors">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-md bg-blue-500/20 flex items-center justify-center">
            <Bell size={18} className="text-blue-400" />
          </div>
          <div>
            <h3 className="text-sm font-normal text-neutral-200">
              Notification
            </h3>
            <p className="text-sm text-neutral-400">{formattedDate}</p>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={toggleDropdown}
            className="p-1.5 hover:bg-neutral-700 rounded-md transition-colors"
          >
            <MoreVertical size={16} className="text-neutral-400" />
          </button>
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-neutral-800 border border-neutral-700 rounded-md z-10 min-w-[120px]">
              <button
                onClick={() => {
                  setIsEditNotificationFormOpen(true);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700 text-sm cursor-pointer text-left"
              >
                <Edit size={14} />
                Edit
              </button>
              <button
                onClick={() => {
                  deleteNotificationMutation.mutate(id);
                  setIsDropdownOpen(false);
                }}
                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700 text-sm text-red-400 cursor-pointer text-left"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="mb-4">
        <p className="text-neutral-200 text-sm leading-relaxed">{message}</p>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className={`px-2 py-1 rounded-md text-sm font-normal border ${getTargetBadgeStyle(forWhom)} flex items-center gap-1`}
          >
            {getTargetIcon(forWhom)}
            {forWhom.charAt(0).toUpperCase() + forWhom.slice(1).toLowerCase()}
          </span>
        </div>
        <div className="flex items-center gap-1 text-sm text-neutral-500">
          <CalendarClock size={12} />
          <span>{formattedDate}</span>
        </div>
      </div>
      {isEditNotificationFormOpen && (
        <EditNotificationForm
          isOpen={isEditNotificationFormOpen}
          onClose={() => setIsEditNotificationFormOpen(false)}
          notification={{
            id,
            message,
            forWhom: forWhom as "ALL" | "EMPLOYEE" | "ADMIN",
          }}
        />
      )}
    </div>
  );
};

export default NotificationCard;
