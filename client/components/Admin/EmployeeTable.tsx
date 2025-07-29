"use client";
import React, { useState } from "react";
import { MoreVertical, Edit, Trash, Plus } from "lucide-react";
import AddAttendanceForm from "./AddAttendanceForm";
import EditAttendanceForm from "./EditAttendanceForm";
import EditEmployeeForm from "./EditEmployeeForm";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import GetCookie from "@/utils/GetCookie";

interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  email: string;
  isActive: boolean;
  phone?: string;
  address?: string;
  dateOfJoining?: string;
  dateOfBirth?: string;
  salary?: number;
  profilePicture?: string;
  attendance?: {
    id: string;
    status: "PRESENT" | "ABSENT" | "HALF_DAY" | "REMOTE";
    date: string;
  }[];
}

const getActiveStyle = (active: boolean) => {
  return active ? "bg-green-600 text-white" : "bg-red-600 text-white";
};

const EmployeeTable = ({ employees }: { employees: Employee[] }) => {
  const queryClient = useQueryClient();
  const [openDropdownIndex, setOpenDropdownIndex] = useState<number | null>(
    null,
  );
  const [isAddAttendanceFormOpen, setIsAddAttendanceFormOpen] = useState(false);
  const [isEditAttendanceFormOpen, setIsEditAttendanceFormOpen] =
    useState(false);
  const [isEditEmployeeFormOpen, setIsEditEmployeeFormOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const deleteEmployeeMutation = useMutation({
    mutationFn: async (id: string) => {
      const API_URL = process.env.NEXT_PUBLIC_API_URL;
      if (!API_URL) throw new Error("API URL missing");

      const res = await fetch(`${API_URL}/employee/delete`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GetCookie()}`,
        },
        body: JSON.stringify({ employeeId: id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Failed to delete employee");
      }
    },
    onSuccess: () => {
      toast.success("Employee deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["employees"] });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to delete employee");
    },
  });

  const toggleDropdown = (index: number) => {
    setOpenDropdownIndex(openDropdownIndex === index ? null : index);
  };

  const handleAddAttendance = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsAddAttendanceFormOpen(true);
    setOpenDropdownIndex(null);
  };

  const handleEditAttendance = (employee: Employee) => {
    if ((employee.attendance?.length ?? 0) > 0) {
      setSelectedEmployee(employee);
      setIsEditAttendanceFormOpen(true);
    }
    setOpenDropdownIndex(null);
  };

  const handleEdit = (employee: Employee) => {
    setSelectedEmployee(employee);
    setIsEditEmployeeFormOpen(true);
    setOpenDropdownIndex(null);
  };

  const handleDelete = (employee: Employee) => {
    deleteEmployeeMutation.mutate(employee.id);
    setOpenDropdownIndex(null);
  };

  return (
    <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md overflow-hidden w-full">
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-neutral-300">
          <thead className="text-sm text-neutral-400 border-b border-neutral-700/50">
            <tr>
              <th className="px-6 py-3">Employee</th>
              <th className="px-6 py-3">Position</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Join Date</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr
                key={employee.id}
                className="border-b border-neutral-700/50 hover:bg-neutral-800/50 relative"
              >
                <td className="px-6 py-4 flex items-center gap-3">
                  <img
                    src={employee.profilePicture}
                    alt={employee.name}
                    className="w-8 h-8 rounded-md object-cover"
                  />
                  <span className="text-neutral-100 font-normal">
                    {employee.name}
                  </span>
                </td>
                <td className="px-6 py-4">{employee.position}</td>
                <td className="px-6 py-4">{employee.department}</td>
                <td className="px-6 py-4">{employee.email}</td>
                <td className="px-6 py-4">
                  {employee.dateOfJoining
                    ? new Date(employee.dateOfJoining).toLocaleDateString()
                    : ""}
                </td>
                <td className="px-6 py-4">
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded text-sm font-normal ${getActiveStyle(employee.isActive)}`}
                  >
                    {employee.isActive ? "Active" : "Inactive"}
                  </div>
                </td>
                <td className="px-6 py-4 relative text-center align-middle">
                  <div className="flex justify-center items-center">
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
                        onClick={() => handleEdit(employee)}
                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700/50 text-sm cursor-pointer text-left transition-colors duration-200"
                      >
                        <Edit size={14} /> Edit
                      </button>
                      <button
                        onClick={() => handleAddAttendance(employee)}
                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700/50 text-sm cursor-pointer text-left transition-colors duration-200"
                      >
                        <Plus size={14} /> Add Attendance
                      </button>
                      <button
                        onClick={() => handleEditAttendance(employee)}
                        className="w-full px-3 py-2 flex items-center gap-2 hover:bg-neutral-700/50 text-sm cursor-pointer text-left transition-colors duration-200"
                      >
                        <Edit size={14} /> Edit Attendance
                      </button>
                      <button
                        onClick={() => handleDelete(employee)}
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

      {selectedEmployee && (
        <AddAttendanceForm
          isOpen={isAddAttendanceFormOpen}
          onClose={() => {
            setIsAddAttendanceFormOpen(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
        />
      )}
      {isEditAttendanceFormOpen &&
        selectedEmployee &&
        selectedEmployee.attendance &&
        selectedEmployee.attendance[0] && (
          <EditAttendanceForm
            isOpen={isEditAttendanceFormOpen}
            onClose={() => {
              setIsEditAttendanceFormOpen(false);
              setSelectedEmployee(null);
            }}
            employee={selectedEmployee}
            attendance={selectedEmployee.attendance[0]}
          />
        )}
      {selectedEmployee && (
        <EditEmployeeForm
          isOpen={isEditEmployeeFormOpen}
          onClose={() => {
            setIsEditEmployeeFormOpen(false);
            setSelectedEmployee(null);
          }}
          employee={selectedEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeTable;
