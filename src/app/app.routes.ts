import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './features/auth/pages/login-page/login-page.component';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';
import { CustomersPageComponent } from './features/customers/pages/customers-page/customers-page.component';
import { AccountsPageComponent } from './features/accounts/pages/accounts-page/accounts-page.component';
import { TransfersPageComponent } from './features/transfers/pages/transfers-page/transfers-page.component';
import { OperationsPageComponent } from './features/operations/pages/operations-page/operations-page.component';
import { AuditPageComponent } from './features/audit/pages/audit-page/audit-page.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: '',
    component: DashboardPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'customers',
    component: CustomersPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'accounts',
    component: AccountsPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'transfers',
    component: TransfersPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'operations',
    component: OperationsPageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'audit',
    component: AuditPageComponent,
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
