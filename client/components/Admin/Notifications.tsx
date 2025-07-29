"use client";
import React, { useState, useMemo } from "react";
import { Plus, Bell } from "lucide-react";
import NotificationCard from "./NotificationCard";
import AddNotificationForm from "./AddNotificationForm";

interface NotificationProps {
  notifications?: any[];
}

const Notifications = ({ notifications = [] }: NotificationProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddNotificationFormOpen, setIsAddNotificationFormOpen] =
    useState(false);

  const filteredNotifications = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return notifications.filter(
      (notification) =>
        notification.message.toLowerCase().includes(term) ||
        notification.forWhom.toLowerCase().includes(term),
    );
  }, [notifications, searchTerm]);

  return (
    <div className="flex flex-col justify-start items-start w-full h-full space-y-5">
      <div className="flex justify-between items-center mb-4 w-full">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-100 font-heading mb-2">
            All Notifications
          </h2>
          <p className="text-neutral-400">Manage and track all notifications</p>
        </div>
        <button
          className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-md text-sm font-normal transition-all duration-200 hover:shadow-blue-600/30 flex items-center gap-2"
          onClick={() => setIsAddNotificationFormOpen(true)}
        >
          <Plus size={16} />
          Add Notification
        </button>
      </div>
      <input
        type="text"
        placeholder="Search Notifications..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-5 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200 w-full max-w-2xl"
      />
      <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-6 w-full">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
          {filteredNotifications.map((notification, index) => (
            <NotificationCard
              key={index}
              id={notification.id}
              message={notification.message}
              forWhom={notification.forWhom}
              createdAt={notification.createdAt}
            />
          ))}
        </div>
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-md bg-neutral-800 flex items-center justify-center">
              <Bell size={24} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-normal text-neutral-300 mb-2">
              No notifications found
            </h3>
            <p className="text-neutral-400 mb-4">
              Create your first notification to get started
            </p>
            <button
              className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-md text-sm font-normal transition-all duration-200 hover:shadow-blue-600/30 flex items-center gap-2 mx-auto"
              onClick={() => setIsAddNotificationFormOpen(true)}
            >
              <Plus size={16} />
              Create Notification
            </button>
          </div>
        )}
      </div>
      {isAddNotificationFormOpen && (
        <AddNotificationForm
          isOpen={isAddNotificationFormOpen}
          onClose={() => setIsAddNotificationFormOpen(false)}
        />
      )}
    </div>
  );
};

export default Notifications;
