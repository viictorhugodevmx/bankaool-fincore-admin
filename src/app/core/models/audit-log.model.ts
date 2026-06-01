export type AuditAction =
  | 'transfer_created'
  | 'transfer_approved'
  | 'transfer_rejected'
  | 'customer_blocked'
  | 'account_blocked'
  | 'account_unblocked';

export type AuditLog = {
  id: string;
  actorUserId: string | null;
  action: AuditAction;
  entityType: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
};
