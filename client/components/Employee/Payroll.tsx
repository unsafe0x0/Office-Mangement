"use client";
import React, { useState } from "react";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import PayrollTable from "./PayrollTable";
import SummaryCard from "./SummaryCard";

interface Payroll {
  id: string;
  month: string;
  year: number;
  basicPay: number;
  bonus: number;
  deductions: number;
  netPay: number;
  createdAt: string;
  updatedAt: string;
}

interface PayrollProps {
  payrolls?: Payroll[];
}

const Payroll = ({ payrolls = [] }: PayrollProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayrolls = payrolls.filter(
    (p) =>
      p.month.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.year.toString().includes(searchTerm),
  );

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const getPayrollSummary = () => {
    if (payrolls.length === 0)
      return {
        totalEarnings: 0,
        totalBonus: 0,
        totalDeductions: 0,
        avgNetPay: 0,
      };

    const totalEarnings = payrolls.reduce((sum, p) => sum + p.basicPay, 0);
    const totalBonus = payrolls.reduce((sum, p) => sum + p.bonus, 0);
    const totalDeductions = payrolls.reduce((sum, p) => sum + p.deductions, 0);
    const avgNetPay =
      payrolls.reduce((sum, p) => sum + p.netPay, 0) / payrolls.length;

    return { totalEarnings, totalBonus, totalDeductions, avgNetPay };
  };

  const summary = getPayrollSummary();

  return (
    <div className="flex flex-col w-full h-full items-start justify-start space-y-5">
      <div className="w-full mb-4">
        <h2 className="text-3xl font-semibold text-neutral-100 font-heading mb-2">
          My Payroll
        </h2>
        <p className="text-neutral-400">
          View your payroll records and earnings
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <SummaryCard
          icon={<DollarSign size={20} className="text-blue-400" />}
          label="Total Earnings"
          value={formatCurrency(summary.totalEarnings)}
        />
        <SummaryCard
          icon={<TrendingUp size={20} className="text-green-400" />}
          label="Total Bonus"
          value={formatCurrency(summary.totalBonus)}
        />
        <SummaryCard
          icon={<TrendingDown size={20} className="text-red-400" />}
          label="Total Deductions"
          value={formatCurrency(summary.totalDeductions)}
        />
        <SummaryCard
          icon={<DollarSign size={20} className="text-purple-400" />}
          label="Avg Net Pay"
          value={formatCurrency(summary.avgNetPay)}
        />
      </div>

      <input
        type="text"
        placeholder="Search Payroll..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="px-5 py-2 bg-neutral-800/70 border border-neutral-600/50 rounded-md text-neutral-100 placeholder-neutral-400 focus:outline-none focus:border-blue-500/50 focus:bg-neutral-800/90 transition-all duration-200 w-full max-w-2xl"
      />

      <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-6 w-full">
        {filteredPayrolls.length > 0 ? (
          <PayrollTable records={filteredPayrolls} />
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-md bg-neutral-800 flex items-center justify-center">
              <DollarSign size={24} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-normal text-neutral-300 mb-2">
              No payroll records found
            </h3>
            <p className="text-neutral-400">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Your payroll records will appear here"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Payroll;
