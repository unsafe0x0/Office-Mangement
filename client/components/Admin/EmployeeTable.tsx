"use client";
import React, { useState } from "react";
import { MoreVertical, Edit, Trash } from "lucide-react";

interface Employee {
    name: string;
    position: string;
    department: string;
    email: string;
    joinDate: string;
    isActive: boolean;
    profilePictureUrl: string;
}

const getActiveStyle = (active: boolean) => {
    return active
        ? "bg-green-600 text-white"
        : "bg-red-600 text-white";
};

const EmployeeTable = ({ employees }: { employees: Employee[] }) => {
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);

    const toggleDropdown = (index: number) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

    const handleEdit = (employee: Employee) => {
        console.log("Edit", employee);
    };

    const handleDelete = (employee: Employee) => {
        console.log("Delete", employee);
    };

    return (
        <div className='overflow-x-auto w-full'>
            <table className='min-w-full text-sm text-left text-neutral-300 whitespace-nowrap'>
                <thead className='text-xs uppercase text-neutral-400 border-b border-neutral-700'>
                    <tr>
                        <th className='px-6 py-3'>Employee</th>
                        <th className='px-6 py-3'>Position</th>
                        <th className='px-6 py-3'>Department</th>
                        <th className='px-6 py-3'>Email</th>
                        <th className='px-6 py-3'>Join Date</th>
                        <th className='px-6 py-3'>Status</th>
                        <th className='px-6 py-3 text-center'>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((employee, index) => (
                        <tr key={index} className='border-b border-neutral-700 relative'>
                            <td className='px-6 py-3 flex items-center gap-3'>
                                <img src={employee.profilePictureUrl} alt={employee.name} className='w-8 h-8 rounded-full object-cover' />
                                {employee.name}
                            </td>
                            <td className='px-6 py-3'>{employee.position}</td>
                            <td className='px-6 py-3'>{employee.department}</td>
                            <td className='px-6 py-3'>{employee.email}</td>
                            <td className='px-6 py-3'>{employee.joinDate}</td>
                            <td className='px-6 py-3'>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getActiveStyle(employee.isActive)}`}>
                                    {employee.isActive ? 'Active' : 'Inactive'}
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
                                            onClick={() => handleEdit(employee)}
                                            className='w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700 text-sm'
                                        >
                                            <Edit size={14} /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(employee)}
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

export default EmployeeTable;
