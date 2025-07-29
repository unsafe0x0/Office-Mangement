"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Calendar,
  DollarSign,
  Calculator,
  TrendingUp,
  TrendingDown,
  ChevronDown,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Button from "../ui/Button";
import RedButton from "../ui/RedButton";
import GetCookie from "@/utils/GetCookie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

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

interface EditPayrollFormProps {
  isOpen: boolean;
  onClose: () => void;
  payroll: PayrollRecord;
}

interface PayrollFormData {
  payrollId: string;
  employeeId: string;
  employeeEmail: string;
  month: string;
  year: string;
  basicPay: string;
  bonus: string;
  deductions: string;
  netPay: string;
}

const EditPayrollForm: React.FC<EditPayrollFormProps> = ({
  isOpen,
  onClose,
  payroll,
}) => {
  const [formData, setFormData] = useState<PayrollFormData>({
    payrollId: "",
    employeeId: "",
    employeeEmail: "",
    month: "",
    year: new Date().getFullYear().toString(),
    basicPay: "",
    bonus: "0",
    deductions: "0",
    netPay: "0",
  });

  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (payroll) {
      setFormData({
        payrollId: payroll.id,
        employeeId: payroll.employeeId,
        employeeEmail: payroll.employeeEmail,
        month: payroll.month,
        year: payroll.year.toString(),
        basicPay: payroll.basicPay.toString(),
        bonus: payroll.bonus.toString(),
        deductions: payroll.deductions.toString(),
        netPay: payroll.netPay.toString(),
      });
    }
  }, [payroll]);

  const updatePayrollMutation = useMutation({
    mutationFn: async (data: PayrollFormData) => {
      if (!API_URL) {
        throw new Error("NEXT_PUBLIC_API_URL is not defined.");
      }

      const response = await fetch(`${API_URL}/payroll/update`, {
        method: "PUT",
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
        throw new Error(errorData.message || "Failed to update payroll");
      }

      return response.json();
    },
    onSuccess: () => {
      toast.success("Payroll updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["payrolls"] });
      handleClose();
    },
    onError: (error) => {
      console.error("Update payroll error:", error.message);
      toast.error(`Failed to update payroll: ${error.message}`);
    },
  });

  const handleInputChange = (field: keyof PayrollFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
      payrollId: "",
      employeeId: "",
      employeeEmail: "",
      month: "",
      year: new Date().getFullYear().toString(),
      basicPay: "",
      bonus: "0",
      deductions: "0",
      netPay: "0",
    });
    setIsMonthDropdownOpen(false);
    setIsYearDropdownOpen(false);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePayrollMutation.mutate(formData);
  };

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
          <h2 className="text-2xl font-bold text-neutral-100">Edit Payroll</h2>
        </div>

        <div className="bg-neutral-800/50 border border-neutral-700 rounded-md p-4 mb-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-md overflow-hidden border border-neutral-600">
              <img
                src={payroll.employee?.profilePicture || "/placeholder.jpg"}
                alt={payroll.employee?.name || "Employee"}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-neutral-100">
                {payroll.employee?.name || "N/A"}
              </h3>
              <p className="text-neutral-400 text-sm">
                {payroll.employee?.email || payroll.employeeEmail}
              </p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative month-dropdown-container">
              <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                <Calendar size={18} />
                Month
              </label>
              <button
                type="button"
                onClick={() => setIsMonthDropdownOpen(!isMonthDropdownOpen)}
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 flex items-center justify-between"
              >
                <span>{formData.month || "Select month"}</span>
                <ChevronDown size={16} className="text-neutral-400" />
              </button>
              {isMonthDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800/90 border border-neutral-600/50 rounded-md z-10 max-h-40 overflow-y-auto">
                  {months.map((month) => (
                    <button
                      key={month}
                      type="button"
                      onClick={() => {
                        handleInputChange("month", month);
                        setIsMonthDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 hover:bg-neutral-700/50 text-sm text-left text-neutral-300"
                    >
                      {month}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="relative year-dropdown-container col-span-2 md:col-span-1">
              <label className="flex items-center gap-2 text-base font-normal text-neutral-300 mb-2">
                <Calendar size={18} />
                Year
              </label>
              <button
                type="button"
                onClick={() => setIsYearDropdownOpen(!isYearDropdownOpen)}
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 flex items-center justify-between"
              >
                <span>{formData.year}</span>
                <ChevronDown size={16} className="text-neutral-400" />
              </button>
              {isYearDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-neutral-800/90 border border-neutral-600/50 rounded-md z-10 max-h-40 overflow-y-auto">
                  {years.map((year) => (
                    <button
                      key={year}
                      type="button"
                      onClick={() => {
                        handleInputChange("year", year.toString());
                        setIsYearDropdownOpen(false);
                      }}
                      className="w-full px-3 py-2 hover:bg-neutral-700/50 text-sm text-left text-neutral-300"
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
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100"
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
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100"
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
                className="w-full px-3 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100"
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
                readOnly
                className="w-full px-3 py-2 bg-neutral-800/50 border border-neutral-600/50 rounded-md text-neutral-300"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 pt-4">
            <Button
              type="submit"
              disabled={updatePayrollMutation.isPending}
              className="w-full"
            >
              {updatePayrollMutation.isPending
                ? "Updating Payroll..."
                : "Update Payroll"}
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

export default EditPayrollForm;
