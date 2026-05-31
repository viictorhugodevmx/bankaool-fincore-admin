export type CustomerKycStatus =
  | 'pending_kyc'
  | 'active'
  | 'blocked'
  | 'rejected';

export type CustomerRiskLevel = 'low' | 'medium' | 'high';

export type Customer = {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  taxId: string;
  occupation: string;
  monthlyIncome: number;
  kycStatus: CustomerKycStatus;
  riskLevel: CustomerRiskLevel;
  createdAt: string;
  updatedAt: string;
};

export type UpdateCustomerStatusPayload = {
  kycStatus: CustomerKycStatus;
};
