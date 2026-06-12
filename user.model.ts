export interface User {
  id: number;
  username: string;
  email: string;
  createdAt: string;
  _count?: { articles: number };
}

export interface UserProfile {
  id: number;
  username: string;
  createdAt: string;
  bio?: string;
  avatarUrl?: string;
  favoriteArtists?: string[];
  _count: { articles: number };
  articles: ProfileArticle[];
}

export interface ProfileArticle {
  id: number;
  title: string;
  createdAt: string;
  artist: { name: string; slug: string };
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
}

export interface UpdateProfileDto {
  username?: string;
  email?: string;
  currentPassword?: string;
  newPassword?: string;
  bio?: string;
  avatarUrl?: string;
  favoriteArtists?: string[];
}