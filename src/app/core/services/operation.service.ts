import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { Transfer } from '../models/transfer.model';

@Injectable({
  providedIn: 'root',
})
export class OperationService {
  private readonly apiUrl = API_CONFIG.baseUrl;

  constructor(private readonly http: HttpClient) {}

  getPendingReviewTransfers(): Observable<ApiResponse<Transfer[]>> {
    return this.http.get<ApiResponse<Transfer[]>>(
      `${this.apiUrl}/operations/transfers/pending-review`
    );
  }

  approveTransfer(transferId: string): Observable<ApiResponse<Transfer>> {
    return this.http.patch<ApiResponse<Transfer>>(
      `${this.apiUrl}/operations/transfers/${transferId}/approve`,
      {}
    );
  }

  rejectTransfer(transferId: string): Observable<ApiResponse<Transfer>> {
    return this.http.patch<ApiResponse<Transfer>>(
      `${this.apiUrl}/operations/transfers/${transferId}/reject`,
      {}
    );
  }
}
