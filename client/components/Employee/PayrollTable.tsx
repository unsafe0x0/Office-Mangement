"use client";
import React from "react";
import { Calendar, TrendingUp, TrendingDown, DollarSign } from "lucide-react";

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

interface PayrollTableProps {
  records: Payroll[];
}

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

const PayrollTable = ({ records }: PayrollTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-neutral-300">
        <thead className="text-sm text-neutral-400 border-b border-neutral-700/50">
          <tr>
            <th className="px-6 py-3">Period</th>
            <th className="px-6 py-3">Basic Pay</th>
            <th className="px-6 py-3">Bonus</th>
            <th className="px-6 py-3">Deductions</th>
            <th className="px-6 py-3">Net Pay</th>
          </tr>
        </thead>
        <tbody>
          {records.map((payroll) => (
            <tr
              key={payroll.id}
              className="border-b border-neutral-800 hover:bg-neutral-800/30 transition-colors"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <Calendar size={14} className="text-neutral-400" />
                  <span className="text-neutral-100">
                    {payroll.month} {payroll.year}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 text-neutral-100">
                {formatCurrency(payroll.basicPay)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-green-400">
                  <TrendingUp size={14} />
                  <span>{formatCurrency(payroll.bonus)}</span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2 text-red-400">
                  <TrendingDown size={14} />
                  <span>{formatCurrency(payroll.deductions)}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-blue-400 font-semibold">
                {formatCurrency(payroll.netPay)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PayrollTable;
