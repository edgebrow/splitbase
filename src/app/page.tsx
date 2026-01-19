"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { CreateBillForm } from "@/components/CreateBillForm";
import { BillCard } from "@/components/BillCard";
import { BillDetail } from "@/components/BillDetail";
import { EmptyState } from "@/components/EmptyState";
import { useBillStore } from "@/lib/store";
import { Bill } from "@/types";

type View = "list" | "create" | "detail";

export default function Home() {
  const [view, setView] = useState<View>("list");
  const [selectedBill, setSelectedBill] = useState<Bill | null>(null);

  const bills = useBillStore((state) => state.bills);

  const handleBillClick = (bill: Bill) => {
    setSelectedBill(bill);
    setView("detail");
  };

  const handleBack = () => {
    setSelectedBill(null);
    setView("list");
  };

  const handleCreateSuccess = () => {
    const latestBill = useBillStore.getState().currentBill;
    if (latestBill) {
      setSelectedBill(latestBill);
      setView("detail");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-lg px-4 py-6">
        {view === "list" && (
          <div className="space-y-6">
            {/* Header Section */}
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Your Bills</h1>
                <p className="text-sm text-gray-500">
                  {bills.length} bill{bills.length !== 1 ? "s" : ""}
                </p>
              </div>
              {bills.length > 0 && (
                <button
                  onClick={() => setView("create")}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
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
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Bill
                </button>
              )}
            </div>

            {/* Bills List or Empty State */}
            {bills.length === 0 ? (
              <EmptyState onCreateBill={() => setView("create")} />
            ) : (
              <div className="space-y-3">
                {bills.map((bill) => (
                  <BillCard
                    key={bill.id}
                    bill={bill}
                    onClick={() => handleBillClick(bill)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {view === "create" && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBack}
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
              <h1 className="text-xl font-bold text-gray-900">Create New Bill</h1>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
              <CreateBillForm onSuccess={handleCreateSuccess} />
            </div>
          </div>
        )}

        {view === "detail" && selectedBill && (
          <BillDetail
            bill={
              bills.find((b) => b.id === selectedBill.id) || selectedBill
            }
            onBack={handleBack}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-lg items-center justify-around py-2">
          <NavButton
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
            }
            label="Home"
            active={view === "list"}
            onClick={handleBack}
          />
          <NavButton
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
            }
            label="New"
            active={view === "create"}
            onClick={() => setView("create")}
          />
          <NavButton
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
            }
            label="Activity"
            active={false}
            onClick={() => alert("Activity feature coming soon!")}
          />
        </div>
      </nav>

      {/* Spacer for bottom nav */}
      <div className="h-20" />
    </div>
  );
}

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}

function NavButton({ icon, label, active, onClick }: NavButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`flex flex-col items-center gap-1 rounded-lg px-6 py-2 transition-colors ${
        active
          ? "text-blue-600"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
      }`}
    >
      {icon}
      <span className="text-xs font-medium">{label}</span>
    </button>
  );
}
