"use client";

import { Bill } from "@/types";
import { formatUSDC } from "@/lib/utils";

interface BillCardProps {
  bill: Bill;
  onClick?: () => void;
}

export function BillCard({ bill, onClick }: BillCardProps) {
  const paidCount = bill.participants.filter((p) => p.paid).length;
  const totalParticipants = bill.participants.length;
  const progress =
    totalParticipants > 0 ? (paidCount / totalParticipants) * 100 : 0;

  const statusColors = {
    pending: "bg-orange-100 text-orange-700",
    partial: "bg-blue-100 text-blue-700",
    settled: "bg-green-100 text-green-700",
  };

  const statusLabels = {
    pending: "Pending",
    partial: "In Progress",
    settled: "Settled",
  };

  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900">{bill.title}</h3>
          {bill.description && (
            <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">
              {bill.description}
            </p>
          )}
        </div>
        <span
          className={`ml-2 rounded-full px-2 py-0.5 text-xs font-medium ${
            statusColors[bill.status]
          }`}
        >
          {statusLabels[bill.status]}
        </span>
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-gray-900">
            {formatUSDC(bill.totalAmount)}
          </p>
          <p className="text-sm text-gray-500">
            {totalParticipants > 0
              ? `${paidCount}/${totalParticipants} paid`
              : "No participants yet"}
          </p>
        </div>

        {totalParticipants > 0 && (
          <div className="flex items-center gap-2">
            <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-600">
              {Math.round(progress)}%
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
        <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>
          {new Date(bill.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      </div>
    </button>
  );
}
