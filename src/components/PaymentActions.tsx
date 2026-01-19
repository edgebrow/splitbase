"use client";

import { useState } from "react";
import { Bill } from "@/types";
import { formatUSDC } from "@/lib/utils";
import { useAccount } from "wagmi";

interface PaymentActionsProps {
  bill: Bill;
}

export function PaymentActions({ bill }: PaymentActionsProps) {
  const [showShareModal, setShowShareModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const { isConnected } = useAccount();

  const unpaidParticipants = bill.participants.filter((p) => !p.paid);
  const totalRemaining = unpaidParticipants.reduce((sum, p) => sum + p.amount, 0);

  const handleShare = async () => {
    const shareText = `💰 SplitBase Bill: ${bill.title}\n\nTotal: ${formatUSDC(bill.totalAmount)}\nPer person: ${formatUSDC(bill.totalAmount / bill.participants.length)}\n\nParticipants:\n${bill.participants.map((p) => `• ${p.name}: ${formatUSDC(p.amount)} ${p.paid ? "✅" : "⏳"}`).join("\n")}\n\nSettle up on Base! 🔵`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `SplitBase: ${bill.title}`,
          text: shareText,
        });
      } catch {
        setShowShareModal(true);
      }
    } else {
      setShowShareModal(true);
    }
  };

  const handleCopy = async () => {
    const shareText = `💰 SplitBase Bill: ${bill.title}\n\nTotal: ${formatUSDC(bill.totalAmount)}\nPer person: ${formatUSDC(bill.totalAmount / bill.participants.length)}\n\nParticipants:\n${bill.participants.map((p) => `• ${p.name}: ${formatUSDC(p.amount)} ${p.paid ? "✅" : "⏳"}`).join("\n")}`;

    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-900">Actions</h3>

      {/* Share Button */}
      <button
        onClick={handleShare}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
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
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
          />
        </svg>
        Share Bill
      </button>

      {/* Request Payment */}
      {unpaidParticipants.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-blue-900">Request Payments</p>
              <p className="text-sm text-blue-700">
                {unpaidParticipants.length} pending • {formatUSDC(totalRemaining)} remaining
              </p>
            </div>
            <button
              onClick={() => alert("Payment request feature coming soon!")}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
            >
              Send Requests
            </button>
          </div>
        </div>
      )}

      {/* Collect Payment (if wallet connected) */}
      {isConnected && unpaidParticipants.length > 0 && (
        <button
          onClick={() => alert("USDC collection feature coming soon!")}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 px-4 py-3 font-medium text-white transition-colors hover:bg-green-700"
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
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          Collect {formatUSDC(totalRemaining)} USDC
        </button>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Share Bill</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
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
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-4 rounded-lg bg-gray-50 p-3">
              <p className="text-sm text-gray-600">
                <strong>{bill.title}</strong>
                <br />
                Total: {formatUSDC(bill.totalAmount)}
                <br />
                Per person: {formatUSDC(bill.totalAmount / bill.participants.length)}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              {copied ? "Copied! ✓" : "Copy to Clipboard"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
