import { Component, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-bg">
        <div class="auth-bg__glow auth-bg__glow--1"></div>
        <div class="auth-bg__glow auth-bg__glow--2"></div>
      </div>
      <div class="auth-card glass-card">
        <div class="auth-logo">
          <span class="auth-logo__icon">◈</span>
          <span class="auth-logo__text">underground<em>wiki</em></span>
        </div>
        <h1 class="auth-title">Junte-se ao arquivo</h1>
        <p class="auth-subtitle">Crie sua conta e comece a documentar a música independente</p>

        <form [formGroup]="form" (ngSubmit)="submit()" class="auth-form">
          <div class="form-group">
            <label>Nome de usuário</label>
            <input type="text" formControlName="username" placeholder="seu_username" />
          </div>
          <div class="form-group">
            <label>E-mail</label>
            <input type="email" formControlName="email" placeholder="seu@email.com" />
          </div>
          <div class="form-group">
            <label>Senha</label>
            <input type="password" formControlName="password" placeholder="Mínimo 6 caracteres" />
          </div>

          @if (error()) {
            <p class="error-msg">⚠ {{ error() }}</p>
          }

          <button type="submit" class="btn-primary auth-submit" [disabled]="loading()">
            @if (loading()) { Criando conta... } @else { Criar conta }
          </button>
        </form>

        <p class="auth-footer">
          Já tem conta? <a routerLink="/login">Entrar</a>
        </p>
      </div>
    </div>
  `,
  styleUrl: '../login/login.component.scss'
})
export class RegisterComponent {
  form: FormGroup;
  error = signal('');
  loading = signal(false);

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    this.form = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit(): void {
    if (this.form.invalid || this.loading()) return;
    this.loading.set(true);
    this.error.set('');

    this.auth.register(this.form.value).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => {
        this.error.set(err.error?.error || 'Erro ao criar conta.');
        this.loading.set(false);
      }
    });
  }
}
