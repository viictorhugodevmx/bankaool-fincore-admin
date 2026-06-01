import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { Account, AccountMovement } from '../models/account.model';
import { ApiResponse } from '../models/api-response.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  private readonly apiUrl = API_CONFIG.baseUrl;

  constructor(private readonly http: HttpClient) {}

  getAccounts(): Observable<ApiResponse<Account[]>> {
    return this.http.get<ApiResponse<Account[]>>(`${this.apiUrl}/accounts`);
  }

  getMovements(accountId: string): Observable<ApiResponse<AccountMovement[]>> {
    return this.http.get<ApiResponse<AccountMovement[]>>(
      `${this.apiUrl}/accounts/${accountId}/movements`
    );
  }
}
