"use client";
import React, { useState } from "react";
import {
  Plus,
  DollarSign,
  Calendar,
  TrendingUp,
  TrendingDown,
} from "lucide-react";
import AddPayrollForm from "./AddPayrollForm";
import Button from "../ui/Button";
import PayrollTable from "./PayrollTable";

interface Payroll {
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

interface PayrollProps {
  payrolls: Payroll[];
  employees: Array<{
    id: string;
    name: string;
    email: string;
    salary?: number;
  }>;
}

const Payroll = ({ payrolls, employees }: PayrollProps) => {
  const [isAddPayrollFormOpen, setIsAddPayrollFormOpen] = useState(false);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const groupedPayrolls = payrolls.reduce(
    (groups, record) => {
      const key = `${record.month} ${record.year}`;
      (groups[key] ||= []).push(record);
      return groups;
    },
    {} as Record<string, Payroll[]>,
  );

  const sortedGroups = Object.keys(groupedPayrolls).sort((a, b) => {
    const [monthA, yearA] = a.split(" ");
    const [monthB, yearB] = b.split(" ");
    return (
      new Date(`${monthB} 1, ${yearB}`).getTime() -
      new Date(`${monthA} 1, ${yearA}`).getTime()
    );
  });

  const totalBasicPay = payrolls.reduce((sum, r) => sum + r.basicPay, 0);
  const totalBonus = payrolls.reduce((sum, r) => sum + r.bonus, 0);
  const totalDeductions = payrolls.reduce((sum, r) => sum + r.deductions, 0);
  const totalNetPay = payrolls.reduce((sum, r) => sum + r.netPay, 0);

  return (
    <div className="flex flex-col justify-start items-start w-full h-full space-y-5">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between w-full gap-2 md:gap-0 mb-2">
        <div className="space-y-2">
          <h2 className="text-3xl font-semibold text-neutral-100 font-heading mb-2">
            Payroll
          </h2>
          <p className="text-neutral-400">
            Manage employee payroll and compensation
          </p>
        </div>
        <Button
          onClick={() => setIsAddPayrollFormOpen(true)}
          icon={<Plus size={18} />}
        >
          Add Payroll
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        <SummaryCard
          title="Total Basic Pay"
          value={formatCurrency(totalBasicPay)}
          icon={<DollarSign size={24} className="text-blue-500" />}
          bgColor="bg-blue-500/10"
          borderColor="border-blue-500/20"
          textColor="text-blue-500"
        />
        <SummaryCard
          title="Total Bonus"
          value={formatCurrency(totalBonus)}
          icon={<TrendingUp size={24} className="text-green-500" />}
          bgColor="bg-green-500/10"
          borderColor="border-green-500/20"
          textColor="text-green-500"
        />
        <SummaryCard
          title="Total Deductions"
          value={formatCurrency(totalDeductions)}
          icon={<TrendingDown size={24} className="text-red-500" />}
          bgColor="bg-red-500/10"
          borderColor="border-red-500/20"
          textColor="text-red-500"
        />
        <SummaryCard
          title="Total Net Pay"
          value={formatCurrency(totalNetPay)}
          icon={<DollarSign size={24} className="text-purple-500" />}
          bgColor="bg-purple-500/10"
          borderColor="border-purple-500/20"
          textColor="text-purple-500"
        />
      </div>

      <div className="space-y-6 w-full">
        {sortedGroups.length > 0 ? (
          sortedGroups.map((groupKey) => (
            <div
              key={groupKey}
              className="bg-neutral-800/50 border border-neutral-700/50  rounded-md overflow-hidden w-full"
            >
              <PayrollTable
                title={groupKey}
                payrolls={groupedPayrolls[groupKey]}
                employees={employees}
              />
            </div>
          ))
        ) : (
          <div className="bg-neutral-800/50 border border-neutral-700/50 rounded-md p-6 w-full text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-4 rounded-md bg-neutral-800 flex items-center justify-center">
              <DollarSign size={24} className="text-neutral-400" />
            </div>
            <h3 className="text-lg font-normal text-neutral-300 mb-2">
              No payroll records found
            </h3>
            <p className="text-neutral-400 mb-4">
              Start managing payroll by adding the first record
            </p>
          </div>
        )}
      </div>

      <AddPayrollForm
        isOpen={isAddPayrollFormOpen}
        onClose={() => setIsAddPayrollFormOpen(false)}
        employees={employees}
      />
    </div>
  );
};

const SummaryCard = ({
  title,
  value,
  icon,
  bgColor,
  borderColor,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  bgColor: string;
  borderColor: string;
  textColor: string;
}) => {
  return (
    <div
      className={`relative overflow-hidden rounded-md border ${borderColor} bg-neutral-800/50 p-6 hover:bg-neutral-800/70 transition-all duration-300 group`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-normal text-neutral-400">{title}</p>
          <p className="text-3xl font-semibold text-neutral-100">{value}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-md ${bgColor} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
      </div>
      <div
        className={`absolute top-0 right-0 w-20 h-20 ${bgColor} rounded-md -translate-y-10 translate-x-10 opacity-20`}
      ></div>
    </div>
  );
};

export default Payroll;
