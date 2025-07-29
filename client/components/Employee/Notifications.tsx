"use client";
import React, { useState, useMemo } from "react";
import { Bell } from "lucide-react";
import NotificationCard from "./NotificationCard";

interface Notification {
  id: string;
  message: string;
  forWhom: string;
  createdAt: string;
  isRead?: boolean;
}

interface NotificationProps {
  notifications?: Notification[];
}

const Notifications = ({ notifications = [] }: NotificationProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredNotifications = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return notifications.filter((notification) =>
      notification.message.toLowerCase().includes(term),
    );
  }, [notifications, searchTerm]);

  const getNotificationSummary = () => {
    const total = notifications.length;
    const unread = notifications.filter((n) => !n.isRead).length;
    return { total, unread };
  };

  const summary = getNotificationSummary();

  return (
    <div className="flex flex-col justify-start items-start w-full h-full space-y-5">
      <div className="flex justify-between items-center mb-4 w-full">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-100 font-heading mb-2">
            My Notifications
          </h2>
          <p className="text-neutral-400">View and manage your notifications</p>
        </div>
      </div>

      <input
        type="text"
        placeholder="Search Notifications..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-5 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200 w-full max-w-2xl"
      />

      <div className="w-full">
        {filteredNotifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
            {filteredNotifications.map((notification) => (
              <NotificationCard
                key={notification.id}
                id={notification.id}
                message={notification.message}
                forWhom={notification.forWhom}
                createdAt={notification.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-12 w-full">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-md bg-neutral-800 flex items-center justify-center">
                <Bell size={24} className="text-neutral-400" />
              </div>
              <h3 className="text-lg font-normal text-neutral-300 mb-2">
                No notifications found
              </h3>
              <p className="text-neutral-400">
                {searchTerm
                  ? "Try adjusting your search terms"
                  : "You'll see your notifications here when you receive them"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
