export type AccountStatus = 'active' | 'blocked' | 'closed';

export type Account = {
  id: string;
  customerId: string;
  accountNumber: string;
  balance: number;
  currency: string;
  status: AccountStatus;
  dailyLimit: number;
  monthlyLimit: number;
  createdAt: string;
  updatedAt: string;
};

export type MovementType =
  | 'deposit'
  | 'transfer_in'
  | 'transfer_out'
  | 'reversal'
  | 'fee';

export type AccountMovement = {
  id: string;
  accountId: string;
  type: MovementType;
  amount: number;
  balanceAfter: number;
  description: string;
  reference: string;
  createdAt: string;
  updatedAt: string;
};
