"use client";

import { Bill } from "@/types";
import { formatUSDC } from "@/lib/utils";
import { useBillStore } from "@/lib/store";
import { ParticipantList } from "./ParticipantList";
import { PaymentActions } from "./PaymentActions";

interface BillDetailProps {
  bill: Bill;
  onBack: () => void;
}

export function BillDetail({ bill, onBack }: BillDetailProps) {
  const { deleteBill, splitEqually } = useBillStore();

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this bill?")) {
      deleteBill(bill.id);
      onBack();
    }
  };

  const statusColors = {
    pending: "bg-orange-100 text-orange-700 border-orange-200",
    partial: "bg-blue-100 text-blue-700 border-blue-200",
    settled: "bg-green-100 text-green-700 border-green-200",
  };

  const statusLabels = {
    pending: "Pending",
    partial: "In Progress",
    settled: "Settled",
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBack}
          className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100"
        >
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <div className="flex-1">
          <h2 className="text-xl font-bold text-gray-900">{bill.title}</h2>
          {bill.description && (
            <p className="text-sm text-gray-500">{bill.description}</p>
          )}
        </div>
      </div>

      {/* Amount Card */}
      <div className="rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white shadow-lg">
        <p className="text-sm font-medium text-blue-100">Total Amount</p>
        <p className="mt-1 text-4xl font-bold">{formatUSDC(bill.totalAmount)}</p>
        <div className="mt-4 flex items-center justify-between">
          <span
            className={`rounded-full border px-3 py-1 text-xs font-medium ${statusColors[bill.status]}`}
          >
            {statusLabels[bill.status]}
          </span>
          <span className="text-sm text-blue-100">
            {bill.participants.length} participant
            {bill.participants.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Split Info */}
      {bill.participants.length > 0 && (
        <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
          <div>
            <p className="text-sm text-gray-600">Each person pays</p>
            <p className="text-xl font-bold text-gray-900">
              {formatUSDC(bill.totalAmount / bill.participants.length)}
            </p>
          </div>
          <button
            onClick={() => splitEqually(bill.id)}
            className="rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50"
          >
            Split Equally
          </button>
        </div>
      )}

      {/* Participants */}
      <ParticipantList bill={bill} />

      {/* Payment Actions */}
      {bill.participants.length > 0 && <PaymentActions bill={bill} />}

      {/* Delete Button */}
      <div className="border-t border-gray-200 pt-4">
        <button
          onClick={handleDelete}
          className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-600 transition-colors hover:bg-red-100"
        >
          Delete Bill
        </button>
      </div>
    </div>
  );
}
