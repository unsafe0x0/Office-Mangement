"use client";
import React from "react";
import {
    Bell,
    User,
    CalendarClock,
    Edit,
    Trash2,
} from "lucide-react";

interface NotificationCardProps {
    message: string;
    forWhom: string;
    createdAt: string;
    onEdit?: () => void;
    onDelete?: () => void;
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

const NotificationCard = ({
    message,
    forWhom,
    createdAt,
    onEdit,
    onDelete,
}: NotificationCardProps) => {
    const formattedDate = formatDate(createdAt);

    return (
        <div className="flex flex-col p-5 rounded-xl bg-neutral-800/70 w-full gap-4 shadow-md">
            <div className="flex items-start text-neutral-300 text-sm">
                <Bell size={16} className="mr-2 text-neutral-400 mt-0.5" />
                <span>{message}</span>
            </div>

            <div className="flex flex-wrap gap-6 text-neutral-300 text-sm">
                <div className="flex items-center">
                    <User size={16} className="mr-2 text-neutral-400" />
                    <span>{forWhom}</span>
                </div>
                <div className="flex items-center">
                    <CalendarClock size={16} className="mr-2 text-neutral-400" />
                    <span>{formattedDate}</span>
                </div>
            </div>

            <div className="flex gap-3 mt-4">
                <button
                    onClick={onEdit}
                    className="flex items-center px-3 py-1.5 rounded-md bg-blue-500 hover:bg-blue-600 text-white text-sm transition-colors cursor-pointer"
                >
                    <Edit size={14} className="mr-2" />
                    Edit
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm transition-colors cursor-pointer"
                >
                    <Trash2 size={14} className="mr-2" />
                    Delete
                </button>
            </div>
        </div>
    );
};

export default NotificationCard;
