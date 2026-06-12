import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  auth = inject(AuthService);
  user = this.auth.currentUser;
  isLoggedIn = this.auth.isLoggedIn;

  menuOpen = false;

  toggleMenu(): void { this.menuOpen = !this.menuOpen; }

  logout(): void {
    this.auth.logout();
    this.menuOpen = false;
  }
}
