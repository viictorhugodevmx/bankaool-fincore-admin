import { HttpClient } from '@angular/common/http';
import { Injectable, computed, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';

import { API_CONFIG } from '../config/api.config';
import { ApiResponse } from '../models/api-response.model';
import { AuthLoginResponse, AuthUser, LoginPayload } from '../models/auth.model';

const TOKEN_KEY = 'bankaool_fincore_token';
const USER_KEY = 'bankaool_fincore_user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = API_CONFIG.baseUrl;

  private readonly tokenSignal = signal<string | null>(
    localStorage.getItem(TOKEN_KEY)
  );

  private readonly userSignal = signal<AuthUser | null>(
    this.getStoredUser()
  );

  readonly token = this.tokenSignal.asReadonly();
  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => Boolean(this.tokenSignal()));

  constructor(private readonly http: HttpClient) {}

  login(payload: LoginPayload): Observable<ApiResponse<AuthLoginResponse>> {
    return this.http
      .post<ApiResponse<AuthLoginResponse>>(`${this.apiUrl}/auth/login`, payload)
      .pipe(
        tap((response) => {
          this.setSession(response.data.token, response.data.user);
        })
      );
  }

  me(): Observable<ApiResponse<AuthUser>> {
    return this.http.get<ApiResponse<AuthUser>>(`${this.apiUrl}/auth/me`);
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);

    this.tokenSignal.set(null);
    this.userSignal.set(null);
  }

  private setSession(token: string, user: AuthUser): void {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));

    this.tokenSignal.set(token);
    this.userSignal.set(user);
  }

  private getStoredUser(): AuthUser | null {
    const rawUser = localStorage.getItem(USER_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      localStorage.removeItem(USER_KEY);
      return null;
    }
  }
}
