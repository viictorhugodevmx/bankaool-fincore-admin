import { Component, computed, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import {
  Account,
  AccountMovement,
  AccountStatus,
  MovementType,
} from '../../../../core/models/account.model';
import { AccountService } from '../../../../core/services/account.service';
import { OperationService } from '../../../../core/services/operation.service';

@Component({
  selector: 'app-accounts-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './accounts-page.component.html',
  styleUrl: './accounts-page.component.scss',
})
export class AccountsPageComponent {
  private readonly accountService = inject(AccountService);
  private readonly operationService = inject(OperationService);

  accounts = signal<Account[]>([]);
  movements = signal<AccountMovement[]>([]);
  selectedAccountId = signal<string | null>(null);

  isLoading = signal(true);
  isLoadingMovements = signal(false);
  errorMessage = signal<string | null>(null);
  movementsErrorMessage = signal<string | null>(null);

  selectedAccount = computed(() => {
    const accountId = this.selectedAccountId();

    return this.accounts().find((account) => account.id === accountId) ?? null;
  });

  actionAccountId = signal<string | null>(null);
  successMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.accountService.getAccounts().subscribe({
      next: (response) => {
        this.accounts.set(response.data);
        this.isLoading.set(false);

        const firstAccount = response.data[0];

        if (firstAccount) {
          this.selectAccount(firstAccount.id);
        }
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to load accounts.'
        );
        this.isLoading.set(false);
      },
    });
  }

  selectAccount(accountId: string): void {
    this.selectedAccountId.set(accountId);
    this.loadMovements(accountId);
  }

  loadMovements(accountId: string): void {
    this.isLoadingMovements.set(true);
    this.movementsErrorMessage.set(null);

    this.accountService.getMovements(accountId).subscribe({
      next: (response) => {
        this.movements.set(response.data);
        this.isLoadingMovements.set(false);
      },
      error: (error) => {
        this.movementsErrorMessage.set(
          error?.error?.message || 'Unable to load account movements.'
        );
        this.isLoadingMovements.set(false);
      },
    });
  }

  formatMoney(value: number, currency = 'MXN'): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(value);
  }

  formatDate(value: string): string {
    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  }

  formatStatus(status: AccountStatus): string {
    const labels: Record<AccountStatus, string> = {
      active: 'Active',
      blocked: 'Blocked',
      closed: 'Closed',
    };

    return labels[status];
  }

  formatMovementType(type: MovementType): string {
    const labels: Record<MovementType, string> = {
      deposit: 'Deposit',
      transfer_in: 'Transfer In',
      transfer_out: 'Transfer Out',
      reversal: 'Reversal',
      fee: 'Fee',
    };

    return labels[type];
  }

  isMoneyIn(type: MovementType): boolean {
    return type === 'deposit' || type === 'transfer_in' || type === 'reversal';
  }

  blockAccount(account: Account): void {
    if (account.status === 'blocked') {
      return;
    }

    this.actionAccountId.set(account.id);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.operationService.blockAccount(account.id).subscribe({
      next: () => {
        this.successMessage.set('Account blocked successfully.');
        this.actionAccountId.set(null);
        this.loadAccounts();
      },
      error: (error) => {
        this.errorMessage.set(error?.error?.message || 'Unable to block account.');
        this.actionAccountId.set(null);
      },
    });
  }

  unblockAccount(account: Account): void {
    if (account.status === 'active') {
      return;
    }

    this.actionAccountId.set(account.id);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.operationService.unblockAccount(account.id).subscribe({
      next: () => {
        this.successMessage.set('Account unblocked successfully.');
        this.actionAccountId.set(null);
        this.loadAccounts();
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to unblock account.'
        );
        this.actionAccountId.set(null);
      },
    });
  }

}
