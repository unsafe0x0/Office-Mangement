import React, { act } from 'react'
import {
  Users,
  CalendarCheck,
  Bell,
  NotepadText
} from "lucide-react";

interface DashboardProps {
  totalEmployees?: number;
  totalLeaves?: number;
  totalTasks?: number;
  totalNotifications?: number;
}

const activities = [
  {
    id: 1,
    title: "Employee John Doe added",
    byWho: "Admin",
    dateTime: "2023-03-01T10:00:00Z",
  },
  {
    id: 2,
    title: "Task 'Design Homepage' assigned to Jane Smith",
    byWho: "Admin",
    dateTime: "2023-03-02T12:30:00Z",
  },
  {
    id: 3,
    title: "Leave request from Mike Johnson approved",
    byWho: "Admin",
    dateTime: "2023-03-03T09:15:00Z",
  },
  {
    id: 4,
    title: "New notification sent to all employees",
    byWho: "Admin",
    dateTime: "2023-03-04T14:45:00Z",
  },
  {
    id: 5,
    title: "Payroll processed for March 2023",
    byWho: "Admin",
    dateTime: "2023-03-05T11:00:00Z",
  },
  {
    id: 6,
    title: "Settings updated by Admin",
    byWho: "Admin",
    dateTime: "2023-03-06T08:30:00Z",
  },
  {
    id: 7,
    title: "New user registered: Sarah Connor",
    byWho: "Admin",
    dateTime: "2023-03-07T10:00:00Z",
  }
]

const Dashboard = ({ totalEmployees, totalLeaves, totalTasks, totalNotifications }: DashboardProps) => {
  return (
    <div className='flex flex-col justify-start items-start w-full h-full space-y-5'>
      <div className='flex flex-col space-y-2'>
        <h2 className='text-3xl font-semibold text-neutral-100 font-heading'>
          Dashboard
        </h2>
        <p className='text-md text-neutral-400'>
          Welcome to the admin dashboard. Here you can manage all aspects of the office management system.
        </p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 w-full'>
        <div className='bg-neutral-800/70 p-4 rounded-lg flex justify-between items-center space-x-3 w-full'>
          <div className='flex flex-col justify-center items-start w-full gap-2'>
            <span className='text-lg font-medium text-neutral-300'>Total Employees</span>
            <span className='text-3xl font-semibold'>{totalEmployees}</span>
          </div>
          <Users size={36} className='text-blue-500' />
        </div>
        <div className='bg-neutral-800/70 p-4 rounded-lg flex justify-between items-center space-x-3 w-full'>
          <div className='flex flex-col justify-center items-start w-full gap-2'>
            <span className='text-lg font-medium text-neutral-300'>Total Leaves</span>
            <span className='text-3xl font-semibold'>{totalLeaves}</span>
          </div>
          <CalendarCheck size={36} className='text-blue-500' />
        </div>
        <div className='bg-neutral-800/70 p-4 rounded-lg flex justify-between items-center space-x-3 w-full'>
          <div className='flex flex-col justify-center items-start w-full gap-2'>
            <span className='text-lg font-medium text-neutral-300'>Total Tasks</span>
            <span className='text-3xl font-semibold'>{totalTasks}</span>
          </div>
          <NotepadText size={36} className='text-blue-500' />
        </div>
        <div className='bg-neutral-800/70 p-4 rounded-lg flex justify-between items-center space-x-3 w-full'>
          <div className='flex flex-col justify-center items-start w-full gap-2'>
            <span className='text-lg font-medium text-neutral-300'>Total Notifications</span>
            <span className='text-3xl font-semibold'>{totalNotifications}</span>
          </div>
          <Bell size={36} className='text-blue-500' />
        </div>
      </div>
      <div className='columns-1 lg:columns-2 gap-5 space-y-5 w-full'>
        <div className='bg-neutral-800/70 p-4 rounded-lg break-inside-avoid'>
          <h3 className='text-2xl font-semibold mb-4 text-neutral-100 font-heading'>
            Recent Activities
          </h3>
          <div className='space-y-2 w-full flex flex-col'>
            {activities.map((activity, index) => (
              <div key={index} className='p-2 w-full border border-neutral-700 rounded-md flex justify-between items-center space-x-3'>
                <div className='flex flex-col justify-start items-start space-y-1'>
                  <span className='text-neutral-300 text-base'>{activity.title}</span>
                  <span className='text-neutral-400 text-sm'>by {activity.byWho}</span>
                </div>
                <span className='text-neutral-400 text-sm'>{new Date(activity.dateTime).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
        <div className='bg-neutral-800/70 p-4 rounded-lg'>
          <h3 className='text-2xl font-semibold mb-4 text-neutral-100 font-heading'>
            Quick Actions
          </h3>
        </div>
      </div>
    </div>
  )
}

export default Dashboard