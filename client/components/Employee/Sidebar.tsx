"use client";
import React from "react";
import {
  LayoutDashboard,
  Settings,
  DollarSign,
  LogOutIcon,
  MenuIcon,
  X,
  CalendarCheck,
  Bell,
  Clock,
} from "lucide-react";
import Image from "next/image";
import RemoveCookie from "@/utils/RemoveCookie";
import { toast } from "react-toastify";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard, color: "text-blue-400" },
  { name: "Leaves", icon: CalendarCheck, color: "text-green-400" },
  { name: "Attendance", icon: Clock, color: "text-purple-400" },
  { name: "Payroll", icon: DollarSign, color: "text-cyan-400" },
  { name: "Notifications", icon: Bell, color: "text-orange-400" },
  { name: "Settings", icon: Settings, color: "text-gray-400" },
];

interface User {
  name: string;
  email: string;
  profilePicture: string;
  role: string;
}

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  open: boolean;
  setOpen: (open: boolean) => void;
}

const handleLogout = () => {
  RemoveCookie();
  toast.success("Logged out successfully");
  window.location.href = "/login";
};

const Sidebar = ({
  activeTab,
  setActiveTab,
  user,
  open,
  setOpen,
}: SidebarProps) => {
  console.log(user);

  const SidebarLinks = () => (
    <nav className="space-y-1">
      {navItems.map(({ name, icon: Icon, color }) => {
        const isActive = activeTab === name;
        return (
          <button
            key={name}
            onClick={() => {
              setActiveTab(name);
              setOpen(false);
            }}
            className={`group flex items-center gap-3 w-full p-2 rounded-md cursor-pointer transition-colors ${
              isActive
                ? "bg-blue-600 text-white"
                : "hover:bg-neutral-700/50 text-neutral-300 hover:text-white"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive ? "text-white" : color}`} />
            <span className="font-normal">{name}</span>
          </button>
        );
      })}
    </nav>
  );

  const Logout = () => (
    <button
      onClick={handleLogout}
      className="flex items-center gap-3 p-2 mt-auto rounded-md bg-red-600 hover:bg-red-700 transition-colors cursor-pointer w-full text-white"
    >
      <LogOutIcon className="w-5 h-5" />
      <span className="font-normal">Logout</span>
    </button>
  );

  const UserCard = () => (
    <div className="flex items-center p-4 rounded-md bg-neutral-800 border border-neutral-700">
      <Image
        src={user.profilePicture || "/placeholder.jpg"}
        alt={"profile picture"}
        width={44}
        height={44}
        className="rounded-md object-cover"
      />
      <div className="ml-3 flex flex-col">
        <span className="font-semibold text-neutral-200">{user.name}</span>
        <span className="text-sm text-neutral-400">{user.email}</span>
      </div>
    </div>
  );

  return (
    <>
      <header className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-neutral-700 bg-neutral-900">
        <h1 className="font-semibold text-2xl font-heading text-neutral-100">
          Employee Portal
        </h1>
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="p-2 rounded-md hover:bg-neutral-800"
          >
            <MenuIcon size={24} className="text-neutral-300" />
          </button>
        ) : (
          <button
            onClick={() => setOpen(false)}
            className="p-2 rounded-md hover:bg-neutral-800"
          >
            <X size={24} className="text-neutral-300" />
          </button>
        )}
      </header>

      <div
        className={`fixed inset-0 z-40 lg:hidden transition-transform duration-300 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div
          className="absolute inset-0 bg-neutral-900/0"
          onClick={() => setOpen(false)}
        />
        <div
          className="relative h-full w-72 flex flex-col bg-neutral-900 p-4 border-r border-neutral-700"
          onClick={(e) => e.stopPropagation()}
        >
          <UserCard />
          <div className="mt-6 flex-1 overflow-y-auto">
            <SidebarLinks />
          </div>
          <Logout />
        </div>
      </div>

      <div className="hidden lg:flex lg:flex-col lg:w-72 h-screen sticky top-0 p-4 border-r border-neutral-700 bg-neutral-900">
        <UserCard />
        <div className="mt-6 flex-1 overflow-y-auto">
          <SidebarLinks />
        </div>
        <Logout />
      </div>
    </>
  );
};

export default Sidebar;
