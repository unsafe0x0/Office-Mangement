"use client";
import React from "react";
import {
  LayoutDashboard,
  Settings,
  ScrollText,
  LogOutIcon,
  MenuIcon,
  X,
  Users,
  CalendarCheck,
  Bell,
  NotepadText
} from "lucide-react";
import Image from "next/image";
import RemoveCookie from "@/utils/RemoveCookie";
import { toast } from "react-toastify";

const navItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Employees", icon: Users },
  { name: "Tasks", icon: NotepadText },
  { name: "Notifications", icon: Bell },
  { name: "Leaves", icon: CalendarCheck },
  { name: "Payroll", icon: ScrollText },
  { name: "Settings", icon: Settings },
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
}

const Sidebar = ({ activeTab, setActiveTab, user, open, setOpen }: SidebarProps) => {
  const SidebarLinks = () => (
    <nav className="space-y-2">
      {navItems.map(({ name, icon: Icon }) => {
        const isActive = activeTab === name;

        return (
          <button
            key={name}
            onClick={() => {
              setActiveTab(name);
              setOpen(false);
            }}
            className={`
              flex w-full items-center md:justify-center lg:justify-start
              gap-2 md:gap-0 lg:gap-2 p-2 rounded-md cursor-pointer transition-colors
              ${isActive
                ? "bg-blue-500 text-white hover:bg-blue-600"
                : "hover:bg-neutral-800/70"
              }
            `}
          >
            <Icon className="w-5 h-5 md:h-6 md:w-6 lg:w-5 lg:h-5 shrink-0" />
            <span className="inline md:hidden lg:inline">{name}</span>
          </button>
        );
      })}
    </nav>
  );

  const Logout = () => (
    <button onClick={handleLogout} className="flex items-center md:justify-center lg:justify-start gap-2 md:gap-0 lg:gap-2 p-2 mt-auto rounded-md bg-red-500 hover:bg-red-600 transition-colors w-full text-white cursor-pointer">
      <LogOutIcon className="w-5 h-5 shrink-0" />
      <span className="inline md:hidden lg:inline">Logout</span>
    </button>
  );

  const UserCard = () => (
    <div className="flex items-center justify-center lg:justify-start p-4 rounded-md bg-neutral-800/70">
      <Image
        src={user.profilePicture || "/placeholder.jpg"}
        alt={user.name}
        width={40}
        height={40}
        className="rounded-md object-cover"
      />
      <div className="flex md:hidden lg:flex flex-col ml-3">
        <span className="font-normal whitespace-nowrap">{user.name}</span>
        <span className="text-sm text-neutral-500">{user.email}</span>
      </div>
    </div>
  );

  return (
    <>
      <header className="flex md:hidden items-center justify-between px-4 py-3 backdrop-blur-sm border-b border-neutral-700 sticky top-0 z-30 bg-transparent">
        <h1 className="font-semibold text-2xl tracking-wide">Office Management</h1>
        <span className="w-6" />
        {!open ? (
          <button onClick={() => setOpen(true)}>
            <MenuIcon size={24} />
          </button>
        ) : (
          <button
            onClick={() => setOpen(false)}
            className="absolute right-4 z-50"
          >
            <X size={24} />
          </button>
        )}
      </header>

      <div
        className={`fixed inset-0 z-40 md:hidden transition-transform ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div
          className="absolute inset-0 bg-neutral-800/70"
          onClick={() => setOpen(false)}
        />
        <div
          className="relative h-full w-68 flex flex-col bg-neutral-800 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <UserCard />
          <div className="mt-6 flex-1 overflow-y-auto">
            <SidebarLinks />
          </div>
          <Logout />
        </div>
      </div>

      <div
        className="
          hidden
          md:flex md:flex-col md:w-20 md:shrink-0
          lg:w-70
          md:h-screen md:sticky md:top-0 p-4
          border-r border-neutral-700
        "
      >
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
