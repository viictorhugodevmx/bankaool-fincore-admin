import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CustomerService } from '../../../../core/services/customer.service';
import {
  Customer,
  CustomerKycStatus,
} from '../../../../core/models/customer.model';

@Component({
  selector: 'app-customers-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './customers-page.component.html',
  styleUrl: './customers-page.component.scss',
})
export class CustomersPageComponent {
  private readonly customerService = inject(CustomerService);

  customers = signal<Customer[]>([]);
  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  updatingCustomerId = signal<string | null>(null);

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.customerService.getCustomers().subscribe({
      next: (response) => {
        this.customers.set(response.data);
        this.isLoading.set(false);
      },
      error: (error) => {
        this.errorMessage.set(
          error?.error?.message || 'Unable to load customers.'
        );
        this.isLoading.set(false);
      },
    });
  }

  updateStatus(customer: Customer, kycStatus: CustomerKycStatus): void {
    if (customer.kycStatus === kycStatus) {
      return;
    }

    this.updatingCustomerId.set(customer.id);

    this.customerService.updateCustomerStatus(customer.id, { kycStatus }).subscribe({
      next: () => {
        this.updatingCustomerId.set(null);
        this.loadCustomers();
      },
      error: (error) => {
        this.updatingCustomerId.set(null);
        this.errorMessage.set(
          error?.error?.message || 'Unable to update customer status.'
        );
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

  formatStatus(status: CustomerKycStatus): string {
    const labels: Record<CustomerKycStatus, string> = {
      pending_kyc: 'Pending KYC',
      active: 'Active',
      blocked: 'Blocked',
      rejected: 'Rejected',
    };

    return labels[status];
  }
}
