"use client";
import React, { useState } from 'react';
import { MoreVertical, Edit, Trash } from 'lucide-react';

interface Leave {
    employeeName: string;
    startDate: string;
    endDate: string;
    reason: string;
    status: string;
    profilePictureUrl: string;
}

const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
        case "approved":
            return "bg-green-600 text-white";
        case "pending":
            return "bg-yellow-500 text-white";
        case "rejected":
            return "bg-red-600 text-white";
        default:
            return "bg-gray-600 text-white";
    }
};

const LeaveTable = ({ leaves }: { leaves: Leave[] }) => {
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

    const toggleDropdown = (index: number) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

    const handleEdit = (leave: Leave) => {
        console.log("Edit", leave);
    };

    const handleDelete = (leave: Leave) => {
        console.log("Delete", leave);
    };

    return (
        <div className='overflow-y-auto w-full'>
            <table className='min-w-full text-sm text-left text-neutral-300 whitespace-nowrap'>
                <thead className='text-xs uppercase text-neutral-400 border-b border-neutral-700'>
                    <tr>
                        <th className='px-6 py-3'>Employee</th>
                        <th className='px-6 py-3'>Start Date</th>
                        <th className='px-6 py-3'>End Date</th>
                        <th className='px-6 py-3'>Reason</th>
                        <th className='px-6 py-3'>Status</th>
                        <th className='px-6 py-3 text-center'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {leaves.map((leave, index) => (
                        <tr key={index} className='border-b border-neutral-700 relative'>
                            <td className='px-6 py-3 flex items-center gap-3'>
                                <img src={leave.profilePictureUrl} alt={leave.employeeName} className='w-8 h-8 rounded-full object-cover' />
                                {leave.employeeName}
                            </td>
                            <td className='px-6 py-3'>{leave.startDate}</td>
                            <td className='px-6 py-3'>{leave.endDate}</td>
                            <td className='px-6 py-3'>{leave.reason}</td>
                            <td className='px-6 py-3'>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusStyle(leave.status)}`}>
                                    {leave.status}
                                </span>
                            </td>
                            <td className='px-6 py-3 relative text-center align-middle'>
                                <div className="flex justify-center items-center">
                                    <button
                                        onClick={() => toggleDropdown(index)}
                                        className='p-1 hover:bg-neutral-700 rounded'
                                    >
                                        <MoreVertical size={16} />
                                    </button>
                                </div>
                                {openDropdownIndex === index && (
                                    <div className="absolute right-4 mt-1 w-28 bg-neutral-800 border border-neutral-700 rounded shadow-md z-10">
                                        <button
                                            onClick={() => handleEdit(leave)}
                                            className='w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700 text-sm'
                                        >
                                            <Edit size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(leave)}
                                            className='w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700 text-sm text-red-400'
                                        >
                                            <Trash size={14} /> Delete
                                        </button>
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default LeaveTable;
