import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Bill, Participant } from "@/types";
import { generateId, calculateEqualSplit } from "./utils";

interface BillStore {
  bills: Bill[];
  currentBill: Bill | null;

  // Actions
  createBill: (title: string, totalAmount: number, description?: string) => Bill;
  updateBill: (billId: string, updates: Partial<Bill>) => void;
  deleteBill: (billId: string) => void;
  setCurrentBill: (bill: Bill | null) => void;

  // Participant actions
  addParticipant: (billId: string, participant: Omit<Participant, "id" | "amount" | "paid">) => void;
  removeParticipant: (billId: string, participantId: string) => void;
  updateParticipantAmount: (billId: string, participantId: string, amount: number) => void;
  markAsPaid: (billId: string, participantId: string, paid: boolean) => void;

  // Split actions
  splitEqually: (billId: string) => void;
  recalculateSplit: (billId: string) => void;
}

export const useBillStore = create<BillStore>()(
  persist(
    (set, get) => ({
      bills: [],
      currentBill: null,

      createBill: (title, totalAmount, description) => {
        const newBill: Bill = {
          id: generateId(),
          title,
          description,
          totalAmount,
          currency: "USDC",
          createdBy: "me",
          createdAt: new Date(),
          participants: [],
          splitType: "equal",
          status: "pending",
        };

        set((state) => ({
          bills: [newBill, ...state.bills],
          currentBill: newBill,
        }));

        return newBill;
      },

      updateBill: (billId, updates) => {
        set((state) => ({
          bills: state.bills.map((bill) =>
            bill.id === billId ? { ...bill, ...updates } : bill
          ),
          currentBill:
            state.currentBill?.id === billId
              ? { ...state.currentBill, ...updates }
              : state.currentBill,
        }));
      },

      deleteBill: (billId) => {
        set((state) => ({
          bills: state.bills.filter((bill) => bill.id !== billId),
          currentBill:
            state.currentBill?.id === billId ? null : state.currentBill,
        }));
      },

      setCurrentBill: (bill) => {
        set({ currentBill: bill });
      },

      addParticipant: (billId, participant) => {
        const bill = get().bills.find((b) => b.id === billId);
        if (!bill) return;

        const newParticipant: Participant = {
          ...participant,
          id: generateId(),
          amount: 0,
          paid: false,
        };

        const updatedParticipants = [...bill.participants, newParticipant];
        const splitAmount = calculateEqualSplit(
          bill.totalAmount,
          updatedParticipants.length
        );

        const participantsWithSplit = updatedParticipants.map((p) => ({
          ...p,
          amount: splitAmount,
        }));

        get().updateBill(billId, { participants: participantsWithSplit });
      },

      removeParticipant: (billId, participantId) => {
        const bill = get().bills.find((b) => b.id === billId);
        if (!bill) return;

        const updatedParticipants = bill.participants.filter(
          (p) => p.id !== participantId
        );

        if (updatedParticipants.length > 0) {
          const splitAmount = calculateEqualSplit(
            bill.totalAmount,
            updatedParticipants.length
          );
          const participantsWithSplit = updatedParticipants.map((p) => ({
            ...p,
            amount: splitAmount,
          }));
          get().updateBill(billId, { participants: participantsWithSplit });
        } else {
          get().updateBill(billId, { participants: [] });
        }
      },

      updateParticipantAmount: (billId, participantId, amount) => {
        const bill = get().bills.find((b) => b.id === billId);
        if (!bill) return;

        const updatedParticipants = bill.participants.map((p) =>
          p.id === participantId ? { ...p, amount } : p
        );

        get().updateBill(billId, {
          participants: updatedParticipants,
          splitType: "custom",
        });
      },

      markAsPaid: (billId, participantId, paid) => {
        const bill = get().bills.find((b) => b.id === billId);
        if (!bill) return;

        const updatedParticipants = bill.participants.map((p) =>
          p.id === participantId ? { ...p, paid } : p
        );

        const allPaid = updatedParticipants.every((p) => p.paid);
        const somePaid = updatedParticipants.some((p) => p.paid);

        get().updateBill(billId, {
          participants: updatedParticipants,
          status: allPaid ? "settled" : somePaid ? "partial" : "pending",
        });
      },

      splitEqually: (billId) => {
        const bill = get().bills.find((b) => b.id === billId);
        if (!bill || bill.participants.length === 0) return;

        const splitAmount = calculateEqualSplit(
          bill.totalAmount,
          bill.participants.length
        );

        const updatedParticipants = bill.participants.map((p) => ({
          ...p,
          amount: splitAmount,
        }));

        get().updateBill(billId, {
          participants: updatedParticipants,
          splitType: "equal",
        });
      },

      recalculateSplit: (billId) => {
        get().splitEqually(billId);
      },
    }),
    {
      name: "splitbase-storage",
    }
  )
);
