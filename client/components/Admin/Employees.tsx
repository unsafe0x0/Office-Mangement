"use client";
import React, { useState, useMemo } from "react";
import { Plus } from "lucide-react";
import EmployeeTable from "./EmployeeTable";
import AddEmployeeForm from "./AddEmployeeForm";
import Button from "../ui/Button";

interface EmployeesProps {
  employees?: any[];
}

const Employees = ({ employees = [] }: EmployeesProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddEmployeeFormOpen, setIsAddEmployeeFormOpen] = useState(false);

  const filteredEmployees = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return employees.filter(
      (emp) =>
        emp.name.toLowerCase().includes(term) ||
        emp.position.toLowerCase().includes(term) ||
        emp.department.toLowerCase().includes(term) ||
        emp.email.toLowerCase().includes(term),
    );
  }, [employees, searchTerm]);

  return (
    <div className="flex flex-col justify-start items-start w-full h-full space-y-5">
      <div className="flex flex-wrap justify-between items-center mb-4 w-full">
        <div>
          <h2 className="text-3xl font-semibold text-neutral-100 font-heading mb-2">
            All Employees
          </h2>
          <p className="text-neutral-400">Manage and track all employees</p>
        </div>
        <Button
          type="submit"
          onClick={() => setIsAddEmployeeFormOpen(true)}
          icon={<Plus />}
        >
          Add Employee
        </Button>
      </div>
      <input
        type="text"
        placeholder="Search Employees..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-5 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200 w-full max-w-2xl"
      />
      <div className="bg-neutral-800/50 border border-neutral-700/50  rounded-md overflow-hidden w-full">
        <EmployeeTable employees={filteredEmployees} />
      </div>
      <AddEmployeeForm
        isOpen={isAddEmployeeFormOpen}
        onClose={() => setIsAddEmployeeFormOpen(false)}
      />
    </div>
  );
};

export default Employees;
