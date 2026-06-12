import { Component, OnInit, signal, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './edit-profile.component.html',
  styleUrl: './edit-profile.component.scss'
})
export class EditProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  user = this.auth.currentUser;

  profileForm: FormGroup;
  passwordForm: FormGroup;

  loading = signal(false);
  passwordLoading = signal(false);
  error = signal('');
  passwordError = signal('');
  success = signal('');
  passwordSuccess = signal('');

  constructor() {
    this.profileForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      bio: [''],
      avatarUrl: [''],
      favoriteArtists: ['']
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  ngOnInit(): void {
    const u = this.user();
    if (u) {
      this.profileForm.patchValue({
        username: u.username,
        email: u.email
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) return;
    this.loading.set(true);
    this.error.set('');
    this.success.set('');

    const { username, email, bio, avatarUrl, favoriteArtists } = this.profileForm.value;

    this.auth.updateProfile({
      username,
      email,
      bio,
      avatarUrl,
      favoriteArtists: favoriteArtists
        ? favoriteArtists.split(',').map((s: string) => s.trim()).filter(Boolean)
        : []
    }).subscribe({
      next: () => {
        this.success.set('Perfil atualizado com sucesso!');
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.error?.error || 'Erro ao atualizar perfil.');
        this.loading.set(false);
      }
    });
  }

  changePassword(): void {
    if (this.passwordForm.invalid) return;
    this.passwordLoading.set(true);
    this.passwordError.set('');
    this.passwordSuccess.set('');

    this.auth.updateProfile(this.passwordForm.value).subscribe({
      next: () => {
        this.passwordSuccess.set('Senha alterada com sucesso!');
        this.passwordForm.reset();
        this.passwordLoading.set(false);
      },
      error: err => {
        this.passwordError.set(err.error?.error || 'Erro ao alterar senha.');
        this.passwordLoading.set(false);
      }
    });
  }

  goToProfile(): void {
    this.router.navigate(['/profile', this.user()?.username]);
  }
}
