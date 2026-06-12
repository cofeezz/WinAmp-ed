export interface Artist {
  id: number;
  name: string;
  slug: string;
  genre?: string;
  origin?: string;
  formedYear?: number;
  bio?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  articles?: ArtistArticle[];
}

export interface ArtistArticle {
  id: number;
  title: string;
  createdAt: string;
  author: { username: string };
}

export interface ArtistListResponse {
  data: Artist[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ArtistFilters {
  search?: string;
  genre?: string;
  page?: number;
  limit?: number;
}
