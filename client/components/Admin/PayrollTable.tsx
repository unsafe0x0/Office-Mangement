"use client";
import React, { useState, useEffect } from "react";
import { Calendar, MoreVertical, Edit, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import GetCookie from "@/utils/GetCookie";
import EditPayrollForm from "./EditPayrollForm";

interface PayrollRecord {
    id: string;
    employeeId: string;
    employeeEmail: string;
    month: string;
    year: number;
    basicPay: number;
    bonus: number;
    deductions: number;
    netPay: number;
    createdAt: string;
    updatedAt: string;
    employee?: {
        id: string;
        name: string;
        email: string;
        profilePicture?: string;
    };
}

interface PayrollTableProps {
    title: string;
    payrolls: PayrollRecord[];
    onEdit?: (payroll: PayrollRecord) => void;
    employees?: Array<{
        id: string;
        name: string;
        email: string;
        salary?: number;
    }>;
}

const PayrollTable = ({ title, payrolls, onEdit, employees = [] }: PayrollTableProps) => {
    const queryClient = useQueryClient();
    const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(null);
    const [openEditForm, setOpenEditForm] = useState<boolean>(false);
    const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('.dropdown-container')) {
                setOpenDropdownIndex(null);
            }
        };

        if (openDropdownIndex !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownIndex]);

    const deletePayrollMutation = useMutation({
        mutationFn: async (id: string) => {
            const API_URL = process.env.NEXT_PUBLIC_API_URL;
            if (!API_URL) throw new Error("API URL missing");

            const res = await fetch(`${API_URL}/payroll/delete`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GetCookie()}`
                },
                body: JSON.stringify({ payrollId: id })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.message || "Failed to delete payroll");
            }
        },
        onSuccess: () => {
            toast.success("Payroll deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["payrolls"] });
        },
        onError: (error) => {
            toast.error(error.message || "Failed to delete payroll");
        }
    });

    const toggleDropdown = (index: number) => {
        setOpenDropdownIndex(openDropdownIndex === index ? null : index);
    };

    const handleEdit = (payroll: PayrollRecord) => {
        if (onEdit) {
            // Use external onEdit if provided (for parent component handling)
            onEdit(payroll);
        } else {
            // Handle internally with EditPayrollForm
            setSelectedPayroll(payroll);
            setOpenEditForm(true);
        }
        setOpenDropdownIndex(null);
    };

    const handleCloseEditForm = () => {
        setOpenEditForm(false);
        setSelectedPayroll(null);
    };

    const handleDelete = (payroll: PayrollRecord) => {
        deletePayrollMutation.mutate(payroll.id);
        setOpenDropdownIndex(null);
    };
    const formatCurrency = (amount: number) =>
        new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount);

    const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString();

    const totalNetPay = payrolls.reduce((sum, r) => sum + r.netPay, 0);

    return (
        <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md overflow-hidden w-full">
            <div className="bg-neutral-800 px-6 py-3 border-b border-neutral-700/50">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-semibold text-neutral-100 flex items-center gap-2">
                            <Calendar size={18} />
                            {title}
                        </h3>
                        <p className="text-neutral-400 text-sm">
                            {payrolls.length} payroll record{payrolls.length !== 1 ? "s" : ""}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-neutral-400 text-sm">Total Net Pay</p>
                        <p className="text-neutral-100 font-semibold">{formatCurrency(totalNetPay)}</p>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left text-neutral-300">
                    <thead className="text-sm uppercase text-neutral-400 border-b border-neutral-700/50">
                        <tr>
                            <th className="px-6 py-3">Employee</th>
                            <th className="px-6 py-3">Basic Pay</th>
                            <th className="px-6 py-3">Bonus</th>
                            <th className="px-6 py-3">Deductions</th>
                            <th className="px-6 py-3">Net Pay</th>
                            <th className="px-6 py-3">Created</th>
                            <th className="px-6 py-3 text-center">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payrolls.map((record, index) => (
                            <tr key={record.id} className="border-b border-neutral-700/50 hover:bg-neutral-800/50 relative">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full overflow-hidden border border-neutral-600">
                                            <img
                                                src={record.employee?.profilePicture || "/placeholder.jpg"}
                                                alt={record.employee?.name || record.employeeEmail}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div>
                                            <div className="font-normal text-neutral-100">
                                                {record.employee?.name || "Unknown Employee"}
                                            </div>
                                            <div className="text-neutral-400 text-sm">
                                                {record.employeeEmail}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">{formatCurrency(record.basicPay)}</td>
                                <td className="px-6 py-4 text-green-400 font-normal">+{formatCurrency(record.bonus)}</td>
                                <td className="px-6 py-4 text-red-400 font-normal">-{formatCurrency(record.deductions)}</td>
                                <td className="px-6 py-4 text-neutral-100 font-semibold">{formatCurrency(record.netPay)}</td>
                                <td className="px-6 py-4 text-neutral-400 text-sm">{formatDate(record.createdAt)}</td>
                                <td className="px-6 py-4 relative text-center align-middle">
                                    <div className="flex justify-center items-center dropdown-container">
                                        <button
                                            onClick={() => toggleDropdown(index)}
                                            className="p-1.5 hover:bg-neutral-700/50 rounded-md transition-all duration-200 cursor-pointer"
                                        >
                                            <MoreVertical size={16} />
                                        </button>
                                    </div>
                                    {openDropdownIndex === index && (
                                        <div className="absolute -left-10 mt-1 bg-neutral-800/90 border border-neutral-600/50 rounded-md z-10 backdrop-blur-sm">
                                            <button
                                                onClick={() => handleEdit(record)}
                                                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700/50 text-sm cursor-pointer text-left transition-colors duration-200"
                                            >
                                                <Edit size={14} /> Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(record)}
                                                className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700/50 text-sm text-red-400 cursor-pointer text-left transition-colors duration-200"
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

            {/* EditPayrollForm Modal */}
            {selectedPayroll && (
                <EditPayrollForm
                    isOpen={openEditForm}
                    onClose={handleCloseEditForm}
                    payroll={selectedPayroll}
                    employees={employees}
                />
            )}
        </div>
    );
};

export default PayrollTable;
