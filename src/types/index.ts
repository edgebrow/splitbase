export interface Participant {
  id: string;
  name: string;
  address?: string;
  fid?: number;
  avatar?: string;
  amount: number;
  paid: boolean;
}

export interface Bill {
  id: string;
  title: string;
  description?: string;
  totalAmount: number;
  currency: "USDC";
  createdBy: string;
  createdAt: Date;
  participants: Participant[];
  splitType: "equal" | "custom" | "percentage";
  status: "pending" | "partial" | "settled";
}

export interface SplitSummary {
  participantId: string;
  owes: number;
  paid: number;
  remaining: number;
}

export interface PaymentRequest {
  billId: string;
  from: string;
  to: string;
  amount: number;
  status: "pending" | "completed" | "cancelled";
  txHash?: string;
}
