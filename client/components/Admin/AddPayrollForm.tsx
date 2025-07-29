"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  DollarSign,
  Calculator,
  TrendingUp,
  TrendingDown,
  Search,
  ChevronDown,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import RedButton from "../ui/RedButton";
import GetCookie from "@/utils/GetCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AddPayrollFormProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Array<{
    id: string;
    name: string;
    email: string;
    salary?: number;
  }>;
}

interface PayrollFormData {
  employeeId: string;
  employeeEmail: string;
  month: string;
  year: string;
  basicPay: string;
  bonus: string;
  deductions: string;
  netPay: string;
}

const AddPayrollForm: React.FC<AddPayrollFormProps> = ({
  isOpen,
  onClose,
  employees,
}) => {
  const [formData, setFormData] = useState<PayrollFormData>({
    employeeId: "",
    employeeEmail: "",
    month: "",
    year: new Date().getFullYear().toString(),
    basicPay: "",
    bonus: "0",
    deductions: "0",
    netPay: "0",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isEmployeeDropdownOpen, setIsEmployeeDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);

  const queryClient = useQueryClient();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".employee-dropdown-container")) {
        setIsEmployeeDropdownOpen(false);
      }
      if (!target.closest(".month-dropdown-container")) {
        setIsMonthDropdownOpen(false);
      }
      if (!target.closest(".year-dropdown-container")) {
        setIsYearDropdownOpen(false);
      }
    };

    if (isEmployeeDropdownOpen || isMonthDropdownOpen || isYearDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEmployeeDropdownOpen, isMonthDropdownOpen, isYearDropdownOpen]);

  const addPayrollMutation = useMutation({
    mutationFn: async (data: PayrollFormData) => {
      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined.");
      }

      const response = await fetch(`${API_URL}/payroll/new`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GetCookie()}`,
        },
        body: JSON.stringify({
          ...data,
          year: parseInt(data.year),
          basicPay: parseFloat(data.basicPay),
          bonus: parseFloat(data.bonus),
          deductions: parseFloat(data.deductions),
          netPay: parseFloat(data.netPay),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add payroll");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Payroll added successfully!");
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      handleClose();
    },
    onError: (error) => {
      console.error("Add payroll error:", error.message);
      toast.error(`Failed to add payroll: ${error.message}`);
    },
  });

  const handleInputChange = (field: keyof PayrollFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleEmployeeChange = (employeeId: string) => {
    const employee = employees.find((emp) => emp.id === employeeId);
    if (employee) {
      setFormData((prev) => ({
        ...prev,
        employeeId,
        employeeEmail: employee.email,
        basicPay: employee.salary?.toString() || "",
      }));
      setIsEmployeeDropdownOpen(false);
    }
  };

  useEffect(() => {
    const basicPay = parseFloat(formData.basicPay) || 0;
    const bonus = parseFloat(formData.bonus) || 0;
    const deductions = parseFloat(formData.deductions) || 0;
    const netPay = basicPay + bonus - deductions;

    setFormData((prev) => ({
      ...prev,
      netPay: netPay.toString(),
    }));
  }, [formData.basicPay, formData.bonus, formData.deductions]);

  const handleClose = () => {
    setFormData({
      employeeId: "",
      employeeEmail: "",
      month: "",
      year: new Date().getFullYear().toString(),
      basicPay: "",
      bonus: "0",
      deductions: "0",
      netPay: "0",
    });
    setSearchTerm("");
    setIsEmployeeDropdownOpen(false);
    setIsMonthDropdownOpen(false);
    setIsYearDropdownOpen(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addPayrollMutation.mutate(formData);
  };

  // Filter employees based on search term
  const filteredEmployees = employees.filter(
    (employee) =>
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  if (!isOpen) return null;

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-b from-neutral-900 to-neutral-800 rounded-md p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-neutral-700/50">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-neutral-100">
            Add New Payroll
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="employee-dropdown-container">
            <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
              <User size={18} />
              Employee
            </label>

            <div className="mb-3">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsEmployeeDropdownOpen(true)}
                  placeholder="Search employees..."
                  className="w-full pl-10 pr-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200"
                />
              </div>
            </div>

            {formData.employeeId && (
              <div className="mb-3 p-3 bg-blue-500/20 border border-blue-500/30 rounded-md">
                <div className="flex items-center justify-between">
                  <span className="text-blue-300 text-sm">
                    Selected:{" "}
                    {
                      employees.find((emp) => emp.id === formData.employeeId)
                        ?.name
                    }
                    (
                    {
                      employees.find((emp) => emp.id === formData.employeeId)
                        ?.email
                    }
                    )
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        employeeId: "",
                        employeeEmail: "",
                        basicPay: "",
                      }));
                      setSearchTerm("");
                    }}
                    className="text-blue-300 hover:text-blue-200 text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>
            )}

            {isEmployeeDropdownOpen && (
              <div className="relative">
                <div className="absolute top-0 left-0 right-0 bg-neutral-800/90 border border-neutral-600/50 rounded-md z-10 backdrop-blur-sm max-h-40 overflow-y-auto">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <button
                        key={employee.id}
                        type="button"
                        onClick={() => {
                          handleEmployeeChange(employee.id);
                          setSearchTerm(employee.name);
                        }}
                        className="w-full px-3 py-2 flex items-center gap-3 hover:bg-neutral-700/50 text-left transition-colors duration-200"
                      >
                        <span className="text-neutral-300 text-sm">
                          {employee.name} ({employee.email})
                          {employee.salary && (
                            <span className="text-neutral-400 ml-2">
                              - ${employee.salary}
                            </span>
                          )}
                        </span>
                      </button>
                    ))
                  ) : (
                    <div className="px-3 py-4 text-center text-neutral-400 text-sm">
                      No employees found matching your search.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative month-dropdown-container">
              <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                <Calendar size={18} />
                Month
              </label>
              <button
                type="button"
                onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 flex items-center justify-between focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200"
              >
                <span>{formData.month || "Select month"}</span>
                <ChevronDown size={16} className="text-neutral-400" />
              </button>
              {isMonthDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800/90 border border-neutral-600/50 rounded-md z-10 backdrop-blur-sm max-h-40 overflow-y-auto">
                  {months.map((month) => (
                    <button
                      key={month}
                      type="button"
                      onClick={() => {
                        handleInputChange("month", month);
                        setIsMonthDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 hover:bg-neutral-700/50 text-sm cursor-pointer text-left transition-colors duration-200 text-neutral-300"
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative year-dropdown-container">
              <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                <Calendar size={18} />
                Year
              </label>
              <button
                type="button"
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 flex items-center justify-between focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200"
              >
                <span>{formData.year}</span>
                <ChevronDown size={16} className="text-neutral-400" />
              </button>
              {isYearDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800/90 border border-neutral-600/50 rounded-md z-10 backdrop-blur-sm max-h-40 overflow-y-auto">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        handleInputChange("year", year.toString());
                        setIsYearDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 hover:bg-neutral-700/50 text-sm cursor-pointer text-left transition-colors duration-200 text-neutral-300"
                    >
                      {year}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                <DollarSign size={18} />
                Basic Pay
              </label>
              <input
                type="number"
                value={formData.basicPay}
                onChange={(e) => handleInputChange("basicPay", e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200"
                placeholder="Enter basic pay"
                step="0.01"
                min="0"
                required
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                <TrendingUp size={18} />
                Bonus
              </label>
              <input
                type="number"
                value={formData.bonus}
                onChange={(e) => handleInputChange("bonus", e.target.value)}
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200"
                placeholder="Enter bonus amount"
                step="0.01"
                min="0"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                <TrendingDown size={18} />
                Deductions
              </label>
              <input
                type="number"
                value={formData.deductions}
                onChange={(e) =>
                  handleInputChange("deductions", e.target.value)
                }
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200"
                placeholder="Enter deductions"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                <Calculator size={18} />
                Net Pay
              </label>
              <input
                type="number"
                value={formData.netPay}
                className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-600/50 rounded-md text-neutral-300 placeholder-neutral-400 focus:outline-none"
                placeholder="Calculated automatically"
                step="0.01"
                readOnly
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Button
              type="submit"
              disabled={addPayrollMutation.isPending}
              className="w-full"
            >
              {addPayrollMutation.isPending
                ? "Adding Payroll..."
                : "Add Payroll"}
            </Button>
            <RedButton type="button" onClick={handleClose} className="w-full">
              Cancel
            </RedButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPayrollForm;
