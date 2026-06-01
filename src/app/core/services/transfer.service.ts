import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { CreateTransferPayload, Transfer } from '../models/transfer.model';

@Injectable({
  providedIn: 'root',
})
export class TransferService {
  private readonly apiUrl = API_CONFIG.baseUrl;

  constructor(private readonly http: HttpClient) {}

  createTransfer(payload: CreateTransferPayload): Observable<ApiResponse<Transfer>> {
    return this.http.post<ApiResponse<Transfer>>(
      `${this.apiUrl}/transfers`,
      payload
    );
  }
}
