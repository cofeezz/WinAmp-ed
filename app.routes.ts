import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'artist/:slug',
    loadComponent: () => import('./pages/artist/artist.component').then(m => m.ArtistComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('./pages/create-page/create-page.component').then(m => m.CreatePageComponent),
    canActivate: [authGuard]
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'profile/:username',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'profile/me/edit',
    loadComponent: () => import('./pages/profile/edit-profile.component').then(m => m.EditProfileComponent),
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: '' }
];