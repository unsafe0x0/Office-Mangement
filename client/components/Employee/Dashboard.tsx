"use client";
import React from "react";
import { CalendarCheck, Bell, DollarSign, Clock } from "lucide-react";
import SummaryCard from "./SummaryCard";
import NotificationCard from "./NotificationCard";
import AttendanceTable from "./AttendanceTable";

interface DashboardProps {
  totalLeaves?: number;
  totalAttendance?: number;
  totalNotifications?: number;
  totalPayrolls?: number;
  recentNotifications?: any[];
  recentLeaves?: any[];
  recentAttendance?: any[];
  setActiveTab: (tab: string) => void;
}

const Dashboard = ({
  totalLeaves,
  totalAttendance,
  totalNotifications,
  totalPayrolls,
  recentNotifications = [],
  recentLeaves = [],
  recentAttendance = [],
  setActiveTab,
}: DashboardProps) => {
  const statsCards = [
    {
      title: "My Leaves",
      value: totalLeaves || 0,
      icon: <CalendarCheck size={20} className="text-green-500" />,
    },
    {
      title: "Attendance Records",
      value: totalAttendance || 0,
      icon: <Clock size={20} className="text-blue-500" />,
    },
    {
      title: "Notifications",
      value: totalNotifications || 0,
      icon: <Bell size={20} className="text-orange-500" />,
    },
    {
      title: "Payroll Records",
      value: totalPayrolls || 0,
      icon: <DollarSign size={20} className="text-purple-500" />,
    },
  ];

  const getStatusBadge = (status: string) => {
    const base = "px-2 py-1 rounded-md text-xs font-medium";
    switch (status) {
      case "APPROVED":
        return `${base} bg-green-500/20 text-green-400`;
      case "PENDING":
        return `${base} bg-yellow-500/20 text-yellow-400`;
      case "REJECTED":
        return `${base} bg-red-500/20 text-red-400`;
      default:
        return `${base} bg-neutral-500/20 text-neutral-400`;
    }
  };

  return (
    <div className="flex flex-col justify-start items-start w-full h-full space-y-5">
      <div className="space-y-2 w-full">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-100 font-heading mb-2">
            Employee Dashboard
          </h2>
          <p className="text-neutral-400">
            Welcome back! Here's your personal overview.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {statsCards.map((card, index) => (
          <SummaryCard
            key={index}
            icon={card.icon}
            label={card.title}
            value={card.value}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-md bg-green-500/20 flex items-center justify-center">
              <CalendarCheck size={20} className="text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-100">
                Recent Leaves
              </h3>
              <p className="text-sm text-neutral-400">
                Your latest leave requests
              </p>
            </div>
          </div>
          {recentLeaves.length > 0 ? (
            <div className="space-y-3">
              {recentLeaves.slice(0, 5).map((leave: any) => (
                <div
                  key={leave.id}
                  className="flex items-center justify-between p-3 rounded-md bg-neutral-800/50 border border-neutral-700/30"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-200">
                      {leave.reason}
                    </p>
                    <p className="text-xs text-neutral-400">
                      {new Date(leave.startDate).toLocaleDateString()} -{" "}
                      {new Date(leave.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={getStatusBadge(leave.status)}>
                    {leave.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CalendarCheck
                size={32}
                className="text-neutral-400 mx-auto mb-2"
              />
              <p className="text-neutral-400">No leave requests yet</p>
            </div>
          )}
        </div>

        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-md bg-blue-500/20 flex items-center justify-center">
              <Clock size={20} className="text-blue-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-100">
                Recent Attendance
              </h3>
              <p className="text-sm text-neutral-400">
                Your latest attendance records
              </p>
            </div>
          </div>
          {recentAttendance.length > 0 ? (
            <AttendanceTable records={recentAttendance.slice(0, 5)} />
          ) : (
            <div className="text-center py-8">
              <Clock size={32} className="text-neutral-400 mx-auto mb-2" />
              <p className="text-neutral-400">No attendance records yet</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-6 w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-md bg-orange-500/20 flex items-center justify-center">
            <Bell size={20} className="text-orange-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-neutral-100">
              Recent Notifications
            </h3>
            <p className="text-sm text-neutral-400">
              Latest notifications for you
            </p>
          </div>
        </div>
        {recentNotifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentNotifications.slice(0, 6).map((n: any) => (
              <NotificationCard
                key={n.id}
                id={n.id}
                message={n.message}
                forWhom={n.forWhom}
                createdAt={n.createdAt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-md bg-neutral-800 flex items-center justify-center">
              <Bell size={24} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-normal text-neutral-300 mb-2">
              No notifications yet
            </h3>
            <p className="text-neutral-400">
              You'll see your notifications here when you receive them
            </p>
          </div>
        )}
      </div>

      <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-6 w-full">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-md bg-purple-500/20 flex items-center justify-center">
            <Clock size={20} className="text-purple-400" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-neutral-100">
              Quick Actions
            </h3>
            <p className="text-sm text-neutral-400">
              Common tasks and shortcuts
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              label: "My Leaves",
              tab: "Leaves",
              icon: <CalendarCheck size={16} className="text-green-400" />,
            },
            {
              label: "Attendance",
              tab: "Attendance",
              icon: <Clock size={16} className="text-blue-400" />,
            },
            {
              label: "Payroll",
              tab: "Payroll",
              icon: <DollarSign size={16} className="text-purple-400" />,
            },
            {
              label: "Notifications",
              tab: "Notifications",
              icon: <Bell size={16} className="text-orange-400" />,
            },
          ].map((action) => (
            <button
              key={action.tab}
              className="p-4 rounded-md border border-neutral-600/50 bg-neutral-800/50 hover:bg-neutral-800/70 transition-all duration-200 text-left group hover:border-neutral-500/50"
              onClick={() => setActiveTab(action.tab)}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-md bg-neutral-700/50 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                  {action.icon}
                </div>
                <div>
                  <p className="text-sm font-normal text-neutral-200">
                    {action.label}
                  </p>
                  <p className="text-sm text-neutral-400">
                    View {action.label.toLowerCase()}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
