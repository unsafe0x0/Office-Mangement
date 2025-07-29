import React, { useState } from "react";
import {
  Users,
  CalendarCheck,
  Bell,
  NotepadText,
  Plus,
  Clock,
} from "lucide-react";
import NotificationCard from "./NotificationCard";
import EmployeeTable from "./EmployeeTable";
import LeaveTable from "./LeaveTable";
import Button from "../ui/Button";
import AddEmployeeForm from "./AddEmployeeForm";
import AddNotificationForm from "./AddNotificationForm";

interface DashboardProps {
  totalEmployees?: number;
  totalLeaves?: number;
  totalTasks?: number;
  totalNotifications?: number;
  notifications?: any[];
  employees?: any[];
  leaves?: any[];
  setActiveTab: (tab: string) => void;
}

const Dashboard = ({
  totalEmployees,
  totalLeaves,
  totalTasks,
  totalNotifications,
  notifications = [],
  employees = [],
  leaves = [],
  setActiveTab,
}: DashboardProps) => {
  const [isAddEmployeeFormOpen, setIsAddEmployeeFormOpen] = useState(false);
  const [isAddNotificationFormOpen, setIsAddNotificationFormOpen] =
    useState(false);
  const statsCards = [
    {
      title: "Total Employees",
      value: totalEmployees || 0,
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Total Leaves",
      value: totalLeaves || 0,
      icon: CalendarCheck,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Total Tasks",
      value: totalTasks || 0,
      icon: NotepadText,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
      borderColor: "border-purple-500/20",
    },
    {
      title: "Total Notifications",
      value: totalNotifications || 0,
      icon: Bell,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
      borderColor: "border-orange-500/20",
    },
  ];

  return (
    <div className="flex flex-col justify-start items-start w-full h-full space-y-5">
      <div className="space-y-2 w-full">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-100 font-heading mb-2">
            Dashboard
          </h2>
          <p className="text-neutral-400">
            Welcome back! Here's what's happening today.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {statsCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className={`relative overflow-hidden rounded-md border ${card.borderColor} bg-neutral-800/50 p-6 hover:bg-neutral-800/70 transition-all duration-300 group`}
            >
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm font-normal text-neutral-400">
                    {card.title}
                  </p>
                  <p className="text-3xl font-bold text-neutral-100">
                    {card.value}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 rounded-md ${card.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <IconComponent size={24} className={card.color} />
                </div>
              </div>
              <div
                className={`absolute top-0 right-0 w-20 h-20 ${card.bgColor} rounded-md -translate-y-10 translate-x-10 opacity-20`}
              ></div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 w-full">
        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-md bg-blue-500/20 flex items-center justify-center">
                <Users size={20} className="text-blue-400" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-neutral-100">
                  Recent Employees
                </h3>
                <p className="text-sm text-neutral-400">
                  Latest employee activities
                </p>
              </div>
            </div>
            <Button
              icon={<Plus size={16} />}
              onClick={() => setIsAddEmployeeFormOpen(true)}
            >
              Add Employee
            </Button>
          </div>
          {isAddEmployeeFormOpen && (
            <AddEmployeeForm
              isOpen={isAddEmployeeFormOpen}
              onClose={() => setIsAddEmployeeFormOpen(false)}
            />
          )}
          <div className="overflow-hidden rounded-md">
            <EmployeeTable employees={employees} />
          </div>
        </div>

        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-md bg-green-500/20 flex items-center justify-center">
              <CalendarCheck size={20} className="text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-100">
                Recent Leaves
              </h3>
              <p className="text-sm text-neutral-400">Latest leave requests</p>
            </div>
          </div>
          <div className="overflow-hidden rounded-md">
            <LeaveTable leaves={leaves} />
          </div>
        </div>
      </div>

      <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-6 w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-md bg-orange-500/20 flex items-center justify-center">
              <Bell size={20} className="text-orange-400" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-neutral-100">
                Recent Notifications
              </h3>
              <p className="text-sm text-neutral-400">
                Latest system notifications
              </p>
            </div>
          </div>
          <Button
            icon={<Plus size={16} />}
            onClick={() => setIsAddNotificationFormOpen(true)}
          >
            New Notification
          </Button>
        </div>
        {isAddNotificationFormOpen && (
          <AddNotificationForm
            isOpen={isAddNotificationFormOpen}
            onClose={() => setIsAddNotificationFormOpen(false)}
          />
        )}
        {notifications.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {notifications.map((notification, index) => (
              <NotificationCard
                key={index}
                id={notification.id}
                message={notification.message}
                forWhom={notification.forWhom}
                createdAt={notification.createdAt}
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
            <p className="text-neutral-400 mb-4">
              Create your first notification to get started
            </p>
            <Button
              icon={<Plus size={16} />}
              onClick={() => setIsAddNotificationFormOpen(true)}
            >
              Create Notification
            </Button>
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
          <button
            className="p-4 rounded-md border border-neutral-600/50 bg-neutral-800/50 hover:bg-neutral-800/70 transition-all duration-200 text-left group hover:border-neutral-500/50"
            onClick={() => setActiveTab("Employees")}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Users size={16} className="text-blue-400" />
              </div>
              <div>
                <p className="text-sm font-normal text-neutral-200">
                  Add Employee
                </p>
                <p className="text-sm text-neutral-400">
                  Register new employee
                </p>
              </div>
            </div>
          </button>
          <button
            className="p-4 rounded-md border border-neutral-600/50 bg-neutral-800/50 hover:bg-neutral-800/70 transition-all duration-200 text-left group hover:border-neutral-500/50"
            onClick={() => setActiveTab("Leaves")}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <CalendarCheck size={16} className="text-green-400" />
              </div>
              <div>
                <p className="text-sm font-normal text-neutral-200">
                  Manage Leaves
                </p>
                <p className="text-sm text-neutral-400">
                  Review leave requests
                </p>
              </div>
            </div>
          </button>
          <button
            className="p-4 rounded-md border border-neutral-600/50 bg-neutral-800/50 hover:bg-neutral-800/70 transition-all duration-200 text-left group hover:border-neutral-500/50"
            onClick={() => setActiveTab("Tasks")}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <NotepadText size={16} className="text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-normal text-neutral-200">
                  Create Task
                </p>
                <p className="text-sm text-neutral-400">Assign new tasks</p>
              </div>
            </div>
          </button>
          <button
            className="p-4 rounded-md border border-neutral-600/50 bg-neutral-800/50 hover:bg-neutral-800/70 transition-all duration-200 text-left group hover:border-neutral-500/50"
            onClick={() => setActiveTab("Notifications")}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-orange-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                <Bell size={16} className="text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-normal text-neutral-200">
                  Send Notification
                </p>
                <p className="text-sm text-neutral-400">Broadcast message</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
