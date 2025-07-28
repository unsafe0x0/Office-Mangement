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
                <div>
                    <h2 className='text-3xl font-semibold text-neutral-100 font-heading mb-2'>All Leaves</h2>
                    <p className="text-neutral-400">Manage and track all leave requests</p>
                </div>
            </div>
            <input
                type="text"
                placeholder="Search Leaves..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-5 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200 w-full max-w-2xl"
            />
            <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md overflow-hidden w-full">
                <LeaveTable leaves={filteredLeaves} />
            </div>
        </div>
    )
}

export default Leaves;
