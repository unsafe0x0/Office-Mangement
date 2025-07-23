"use client"
import React, { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import NotificationCard from './NotificationCard'

interface NotificationProps {
    notifications?: any[];
}

const Notifications = ({ notifications = [] }: NotificationProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredNotifications = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return notifications.filter((notification) =>
            notification.message.toLowerCase().includes(term) ||
            notification.forWhom.toLowerCase().includes(term)
        );
    }, [notifications, searchTerm]);

    return (
        <div className='flex flex-col justify-start items-start w-full h-full space-y-5'>
            <div className='flex justify-between items-center mb-4 w-full'>
                <h3 className='text-2xl font-semibold text-neutral-100 font-heading'>All Notifications</h3>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition cursor-pointer flex items-center gap-2'>
                    <Plus size={16} />
                    Add Notification
                </button>
            </div>
            <input
                type="text"
                placeholder="Search Notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-5 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full max-w-2xl"
            />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full'>
                {filteredNotifications.map((notification, index) => (
                    <NotificationCard
                        key={index}
                        message={notification.message}
                        forWhom={notification.forWhom}
                        createdAt={notification.createdAt}
                    />
                ))}
            </div>
        </div>
    )
}

export default Notifications;
