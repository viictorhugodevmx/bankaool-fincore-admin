import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';
import { LoginPageComponent } from './features/auth/pages/login-page/login-page.component';
import { DashboardPageComponent } from './features/dashboard/pages/dashboard-page/dashboard-page.component';
import { CustomersPageComponent } from './features/customers/pages/customers-page/customers-page.component';
import { AccountsPageComponent } from './features/accounts/pages/accounts-page/accounts-page.component';
import { TransfersPageComponent } from './features/transfers/pages/transfers-page/transfers-page.component';
import { OperationsPageComponent } from './features/operations/pages/operations-page/operations-page.component';
import { AuditPageComponent } from './features/audit/pages/audit-page/audit-page.component';
import { AppShellComponent } from './shared/components/app-shell/app-shell.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
  },
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        component: DashboardPageComponent,
      },
      {
        path: 'customers',
        component: CustomersPageComponent,
      },
      {
        path: 'accounts',
        component: AccountsPageComponent,
      },
      {
        path: 'transfers',
        component: TransfersPageComponent,
      },
      {
        path: 'operations',
        component: OperationsPageComponent,
      },
      {
        path: 'audit',
        component: AuditPageComponent,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
