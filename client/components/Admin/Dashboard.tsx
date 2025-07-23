import React from 'react';
import {
  Users,
  CalendarCheck,
  Bell,
  NotepadText,
  Plus
} from "lucide-react";
import NotificationCard from './NotificationCard';
import EmployeeTable from './EmployeeTable';
import LeaveTable from './LeaveTable';

interface DashboardProps {
  totalEmployees?: number;
  totalLeaves?: number;
  totalTasks?: number;
  totalNotifications?: number;
  notifications?: any[];
  employees?: any[];
  leaves?: any[];
}

const Dashboard = ({
  totalEmployees,
  totalLeaves,
  totalTasks,
  totalNotifications,
  notifications = [],
  employees = [],
  leaves = []
}: DashboardProps) => {
  return (
    <div className='flex flex-col justify-start items-start w-full h-full space-y-5'>
      <div className='flex flex-col space-y-2'>
        <h2 className='text-3xl font-semibold text-neutral-100 font-heading'>Dashboard</h2>
        <p className='text-md text-neutral-400'>
          Welcome to the admin dashboard. Here you can manage all aspects of the office management system.
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full'>
        {[{
          title: 'Total Employees',
          value: totalEmployees,
          icon: <Users size={36} className='text-blue-500' />
        }, {
          title: 'Total Leaves',
          value: totalLeaves,
          icon: <CalendarCheck size={36} className='text-blue-500' />
        }, {
          title: 'Total Tasks',
          value: totalTasks,
          icon: <NotepadText size={36} className='text-blue-500' />
        }, {
          title: 'Total Notifications',
          value: totalNotifications,
          icon: <Bell size={36} className='text-blue-500' />
        }].map((item, idx) => (
          <div key={idx} className='bg-neutral-800/70 p-4 rounded-lg flex justify-between items-center'>
            <div className='flex flex-col gap-2'>
              <span className='text-lg font-medium text-neutral-300 whitespace-nowrap'>{item.title}</span>
              <span className='text-3xl font-semibold'>{item.value}</span>
            </div>
            {item.icon}
          </div>
        ))}
      </div>
      <div className='columns-1 md:columns-2 space-y-5 gap-5 w-full'>
        <div className='bg-neutral-800/70 p-4 rounded-lg break-inside-avoid'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-2xl font-semibold text-neutral-100 font-heading'>Recent Employees</h3>
            <button className='bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition cursor-pointer flex items-center gap-2'>
              <Plus size={16} />
              Add Employee
            </button>
          </div>
          <EmployeeTable employees={employees} />
        </div>
        <div className='bg-neutral-800/70 p-4 rounded-lg break-inside-avoid'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-2xl font-semibold text-neutral-100 font-heading'>Recent Leaves</h3>
          </div>
          <LeaveTable leaves={leaves} />
        </div>
      </div>
      <div className='bg-neutral-800/70 p-4 rounded-lg w-full'>
        <div className='flex justify-between items-center mb-4'>
          <h3 className='text-2xl font-semibold text-neutral-100 font-heading'>Recent Notifications</h3>
          <button className='bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition cursor-pointer flex items-center gap-2'>
            <Plus size={16} />
            New Notification
          </button>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 lg:grid-cols-4 w-full'>
          {notifications.map((notification, index) => (
            <NotificationCard
              key={index}
              message={notification.message}
              forWhom={notification.forWhom}
              createdAt={notification.createdAt}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;