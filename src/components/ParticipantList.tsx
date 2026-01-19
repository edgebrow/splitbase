"use client";

import { useState } from "react";
import { useBillStore } from "@/lib/store";
import { formatUSDC, shortenAddress } from "@/lib/utils";
import { Bill, Participant } from "@/types";

interface ParticipantListProps {
  bill: Bill;
}

export function ParticipantList({ bill }: ParticipantListProps) {
  const [newName, setNewName] = useState("");
  const [newAddress, setNewAddress] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  const { addParticipant, removeParticipant, markAsPaid } = useBillStore();

  const handleAddParticipant = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    addParticipant(bill.id, {
      name: newName.trim(),
      address: newAddress.trim() || undefined,
    });

    setNewName("");
    setNewAddress("");
    setShowAddForm(false);
  };

  const totalOwed = bill.participants.reduce((sum, p) => sum + p.amount, 0);
  const totalPaid = bill.participants
    .filter((p) => p.paid)
    .reduce((sum, p) => sum + p.amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Participants</h3>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-1 rounded-lg bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-100"
        >
          <svg
            className="h-4 w-4"
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
          Add
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAddParticipant}
          className="rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <div className="space-y-3">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Name"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              autoFocus
            />
            <input
              type="text"
              value={newAddress}
              onChange={(e) => setNewAddress(e.target.value)}
              placeholder="Wallet address (optional)"
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Add Participant
              </button>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      )}

      {bill.participants.length === 0 ? (
        <div className="rounded-lg border-2 border-dashed border-gray-200 p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            />
          </svg>
          <p className="mt-2 text-sm text-gray-500">
            Add participants to split this bill
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {bill.participants.map((participant) => (
            <ParticipantCard
              key={participant.id}
              participant={participant}
              billId={bill.id}
              onRemove={() => removeParticipant(bill.id, participant.id)}
              onTogglePaid={() =>
                markAsPaid(bill.id, participant.id, !participant.paid)
              }
            />
          ))}
        </div>
      )}

      {bill.participants.length > 0 && (
        <div className="rounded-lg bg-gray-50 p-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Total Split</span>
            <span className="font-medium text-gray-900">
              {formatUSDC(totalOwed)}
            </span>
          </div>
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-gray-600">Collected</span>
            <span className="font-medium text-green-600">
              {formatUSDC(totalPaid)}
            </span>
          </div>
          <div className="mt-1 flex justify-between text-sm">
            <span className="text-gray-600">Remaining</span>
            <span className="font-medium text-orange-600">
              {formatUSDC(totalOwed - totalPaid)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

interface ParticipantCardProps {
  participant: Participant;
  billId: string;
  onRemove: () => void;
  onTogglePaid: () => void;
}

function ParticipantCard({
  participant,
  onRemove,
  onTogglePaid,
}: ParticipantCardProps) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-3 transition-colors ${
        participant.paid
          ? "border-green-200 bg-green-50"
          : "border-gray-200 bg-white"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-medium ${
            participant.paid
              ? "bg-green-200 text-green-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {participant.avatar ? (
            <img
              src={participant.avatar}
              alt={participant.name}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            participant.name.charAt(0).toUpperCase()
          )}
        </div>
        <div>
          <p className="font-medium text-gray-900">{participant.name}</p>
          {participant.address && (
            <p className="text-xs text-gray-500">
              {shortenAddress(participant.address)}
            </p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="text-right">
          <p className="font-semibold text-gray-900">
            {formatUSDC(participant.amount)}
          </p>
          <p
            className={`text-xs ${
              participant.paid ? "text-green-600" : "text-orange-600"
            }`}
          >
            {participant.paid ? "Paid" : "Pending"}
          </p>
        </div>

        <div className="flex gap-1">
          <button
            onClick={onTogglePaid}
            className={`rounded-lg p-2 transition-colors ${
              participant.paid
                ? "bg-green-100 text-green-600 hover:bg-green-200"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
            title={participant.paid ? "Mark as unpaid" : "Mark as paid"}
          >
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </button>
          <button
            onClick={onRemove}
            className="rounded-lg bg-gray-100 p-2 text-gray-600 transition-colors hover:bg-red-100 hover:text-red-600"
            title="Remove participant"
          >
            <svg
              className="h-4 w-4"
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
      </div>
    </div>
  );
}
