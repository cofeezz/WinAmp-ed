import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Artist, ArtistFilters, ArtistListResponse } from '../models/artist.model';

@Injectable({ providedIn: 'root' })
export class ArtistService {
  private base = `${environment.apiUrl}/artists`;

  constructor(private http: HttpClient) {}

  list(filters?: ArtistFilters): Observable<ArtistListResponse> {
    let params = new HttpParams();
    if (filters?.search) params = params.set('search', filters.search);
    if (filters?.genre) params = params.set('genre', filters.genre);
    if (filters?.page) params = params.set('page', filters.page.toString());
    if (filters?.limit) params = params.set('limit', filters.limit.toString());
    return this.http.get<ArtistListResponse>(this.base, { params });
  }

  getBySlug(slug: string): Observable<Artist> {
    return this.http.get<Artist>(`${this.base}/${slug}`);
  }

  create(data: Partial<Artist>): Observable<Artist> {
    return this.http.post<Artist>(this.base, data);
  }

  update(slug: string, data: Partial<Artist>): Observable<Artist> {
    return this.http.put<Artist>(`${this.base}/${slug}`, data);
  }

  delete(slug: string): Observable<void> {
    return this.http.delete<void>(`${this.base}/${slug}`);
  }
}