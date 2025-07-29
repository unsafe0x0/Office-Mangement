"use client";
import React from "react";

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: number | string;
}

const SummaryCard = ({ icon, label, value }: SummaryCardProps) => {
  return (
    <div className="bg-neutral-800/70 border border-neutral-700/50 rounded-md p-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-md bg-neutral-700/50 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <p className="text-sm text-neutral-400">{label}</p>
          <p className="text-xl font-semibold text-neutral-100">{value}</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
