import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Transfer, TransferStatus } from '../../../../core/models/transfer.model';
import { OperationService } from '../../../../core/services/operation.service';

@Component({
  selector: 'app-operations-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './operations-page.component.html',
  styleUrl: './operations-page.component.scss',
})
export class OperationsPageComponent {
  private readonly operationService = inject(OperationService);

  pendingTransfers = signal<Transfer[]>([]);
  isLoading = signal(true);
  actionTransferId = signal<string | null>(null);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadPendingTransfers();
  }

  loadPendingTransfers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.operationService.getPendingReviewTransfers().subscribe({
      next: (response) => {
        this.pendingTransfers.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to load pending transfers.'
        );
        this.isLoading.set(false);
      },
    });
  }

  approveTransfer(transfer: Transfer): void {
    this.actionTransferId.set(transfer.id);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.operationService.approveTransfer(transfer.id).subscribe({
      next: () => {
        this.successMessage.set('Transfer approved successfully.');
        this.actionTransferId.set(null);
        this.loadPendingTransfers();
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to approve transfer.'
        );
        this.actionTransferId.set(null);
      },
    });
  }

  rejectTransfer(transfer: Transfer): void {
    this.actionTransferId.set(transfer.id);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.operationService.rejectTransfer(transfer.id).subscribe({
      next: () => {
        this.successMessage.set('Transfer rejected successfully.');
        this.actionTransferId.set(null);
        this.loadPendingTransfers();
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to reject transfer.'
        );
        this.actionTransferId.set(null);
      },
    });
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  formatStatus(status: TransferStatus): string {
    const labels: Record<TransferStatus, string> = {
      completed: 'Completed',
      pending_review: 'Pending Review',
      rejected: 'Rejected',
      failed: 'Failed',
    };

    return labels[status];
  }
}
