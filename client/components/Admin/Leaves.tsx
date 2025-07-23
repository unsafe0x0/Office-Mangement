"use client"
import React, { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import LeaveTable from './LeaveTable'

interface LeavesProps {
    leaves?: any[];
}

const Leaves = ({ leaves = [] }: LeavesProps) => {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredLeaves = useMemo(() => {
        const term = searchTerm.toLowerCase();
        return leaves.filter((leave) =>
            leave.employeeName.toLowerCase().includes(term) ||
            leave.reason.toLowerCase().includes(term) ||
            leave.status.toLowerCase().includes(term)
        );
    }, [leaves, searchTerm]);

    return (
        <div className='flex flex-col justify-start items-start w-full h-full space-y-5'>
            <div className='flex justify-between items-center mb-4 w-full'>
                <h3 className='text-2xl font-semibold text-neutral-100 font-heading'>All Leaves</h3>
                <button className='bg-blue-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-600 transition cursor-pointer flex items-center gap-2'>
                    <Plus size={16} />
                    Add Leave
                </button>
            </div>
            <input
                type="text"
                placeholder="Search Leaves..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-5 py-2 bg-neutral-800/70 border border-neutral-700 rounded text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full max-w-2xl"
            />
            <LeaveTable leaves={filteredLeaves} />
        </div>
    )
}

export default Leaves;
