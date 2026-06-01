export type TransferStatus = 'completed' | 'pending_review' | 'rejected' | 'failed';

export type Transfer = {
  id: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  status: TransferStatus;
  description: string;
  reference: string;
  riskScore: number;
  riskReasons: string[];
  createdAt: string;
  updatedAt: string;
};

export type CreateTransferPayload = {
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  description: string;
};
