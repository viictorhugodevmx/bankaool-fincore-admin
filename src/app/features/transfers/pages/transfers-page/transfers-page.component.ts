import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { Account } from '../../../../core/models/account.model';
import { Transfer, TransferStatus } from '../../../../core/models/transfer.model';
import { AccountService } from '../../../../core/services/account.service';
import { TransferService } from '../../../../core/services/transfer.service';

@Component({
  selector: 'app-transfers-page',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './transfers-page.component.html',
  styleUrl: './transfers-page.component.scss',
})
export class TransfersPageComponent {
  private readonly accountService = inject(AccountService);
  private readonly transferService = inject(TransferService);

  accounts = signal<Account[]>([]);
  createdTransfers = signal<Transfer[]>([]);

  fromAccountId = '';
  toAccountId = '';
  amount: number | null = 5000;
  description = 'Internal transfer test';

  isLoadingAccounts = signal(true);
  isSubmitting = signal(false);
  errorMessage = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  fromAccount = computed(() =>
    this.accounts().find((account) => account.id === this.fromAccountId) ?? null
  );

  toAccount = computed(() =>
    this.accounts().find((account) => account.id === this.toAccountId) ?? null
  );

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoadingAccounts.set(true);
    this.errorMessage.set(null);

    this.accountService.getAccounts().subscribe({
      next: (response) => {
        this.accounts.set(response.data);
        this.isLoadingAccounts.set(false);

        if (response.data.length >= 2) {
          this.fromAccountId = response.data[0].id;
          this.toAccountId = response.data[1].id;
        }
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to load accounts.'
        );
        this.isLoadingAccounts.set(false);
      },
    });
  }

  submitTransfer(): void {
    this.errorMessage.set(null);
    this.successMessage.set(null);

    if (!this.fromAccountId || !this.toAccountId || !this.amount || !this.description.trim()) {
      this.errorMessage.set('Complete all transfer fields.');
      return;
    }

    if (this.fromAccountId === this.toAccountId) {
      this.errorMessage.set('Origin and destination accounts must be different.');
      return;
    }

    this.isSubmitting.set(true);

    this.transferService
      .createTransfer({
        fromAccountId: this.fromAccountId,
        toAccountId: this.toAccountId,
        amount: Number(this.amount),
        description: this.description.trim(),
      })
      .subscribe({
        next: (response) => {
          this.createdTransfers.update((items) => [response.data, ...items]);
          this.successMessage.set(
            response.data.status === 'pending_review'
              ? 'Transfer created and sent to pending review.'
              : 'Transfer completed successfully.'
          );
          this.isSubmitting.set(false);
          this.loadAccounts();
        },
        error: (error) => {
          this.errorMessage.set(
            error?.error?.message || 'Unable to create transfer.'
          );
          this.isSubmitting.set(false);
        },
      });
  }

  useNormalPreset(): void {
    this.amount = 5000;
    this.description = 'Internal transfer test';
  }

  useRiskPreset(): void {
    this.amount = 21000;
    this.description = 'test-risk operation review';
  }

  formatMoney(value: number, currency = 'MXN'): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
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

  accountLabel(accountId: string): string {
    const account = this.accounts().find((item) => item.id === accountId);

    return account ? account.accountNumber : accountId;
  }
}
