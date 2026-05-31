import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import {
  Customer,
  UpdateCustomerStatusPayload,
} from '../models/customer.model';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private readonly apiUrl = API_CONFIG.baseUrl;

  constructor(private readonly http: HttpClient) {}

  getCustomers(): Observable<ApiResponse<Customer[]>> {
    return this.http.get<ApiResponse<Customer[]>>(`${this.apiUrl}/customers`);
  }

  updateCustomerStatus(
    customerId: string,
    payload: UpdateCustomerStatusPayload
  ): Observable<ApiResponse<Customer>> {
    return this.http.patch<ApiResponse<Customer>>(
      `${this.apiUrl}/customers/${customerId}/status`,
      payload
    );
  }
}
