import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AuditAction, AuditLog } from '../../../../core/models/audit-log.model';
import { AuditLogService } from '../../../../core/services/audit-log.service';

@Component({
  selector: 'app-audit-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './audit-page.component.html',
  styleUrl: './audit-page.component.scss',
})
export class AuditPageComponent {
  private readonly auditLogService = inject(AuditLogService);

  auditLogs = signal<AuditLog[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAuditLogs();
  }

  loadAuditLogs(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.auditLogService.getAuditLogs().subscribe({
      next: (response) => {
        this.auditLogs.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to load audit logs.'
        );
        this.isLoading.set(false);
      },
    });
  }

  formatAction(action: AuditAction): string {
    const labels: Record<AuditAction, string> = {
      transfer_created: 'Transfer Created',
      transfer_approved: 'Transfer Approved',
      transfer_rejected: 'Transfer Rejected',
      customer_blocked: 'Customer Blocked',
      account_blocked: 'Account Blocked',
      account_unblocked: 'Account Unblocked',
    };

    return labels[action];
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  formatMetadata(metadata: Record<string, unknown>): string {
    return JSON.stringify(metadata, null, 2);
  }
}
