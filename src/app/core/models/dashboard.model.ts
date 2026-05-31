export type DashboardSummary = {
  customers: {
    total: number;
    active: number;
    pendingKyc: number;
    blocked: number;
    rejected: number;
  };
  accounts: {
    total: number;
    active: number;
    blocked: number;
    closed: number;
    totalBalance: number;
  };
  transfers: {
    total: number;
    today: number;
    completed: number;
    pendingReview: number;
    rejected: number;
    failed: number;
  };
  risk: {
    alerts: number;
    highRiskCustomers: number;
    pendingReviewTransfers: number;
  };
};
