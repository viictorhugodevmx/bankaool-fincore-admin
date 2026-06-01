import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app-shell.component.html',
  styleUrl: './app-shell.component.scss',
})
export class AppShellComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user = this.authService.user;

  navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Customers', path: '/customers' },
    { label: 'Accounts', path: '/accounts' },
    { label: 'Transfers', path: '/transfers' },
    { label: 'Operations', path: '/operations' },
    { label: 'Audit Logs', path: '/audit' },
  ];

  logout(): void {
    this.authService.logout();
    this.router.navigateByUrl('/login');
  }
}
