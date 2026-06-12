import { Component, OnInit, signal, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';
import { UserProfile } from '../../core/models/user.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private auth = inject(AuthService);

  profile = signal<UserProfile | null>(null);
  loading = signal(true);
  notFound = signal(false);

  currentUser = this.auth.currentUser;

  get isOwnProfile(): boolean {
    return this.currentUser()?.username === this.profile()?.username;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadProfile(params['username']);
    });
  }

  private loadProfile(username: string): void {
    this.loading.set(true);
    this.notFound.set(false);

    this.http.get<UserProfile>(`${environment.apiUrl}/users/${username}`).subscribe({
      next: profile => {
        this.profile.set(profile);
        this.loading.set(false);
      },
      error: () => {
        this.notFound.set(true);
        this.loading.set(false);
      }
    });
  }
}
