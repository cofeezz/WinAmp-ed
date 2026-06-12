import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Article, CreateArticleDto, UpdateArticleDto } from '../models/article.model';

interface ArticleListResponse {
  data: Article[];
  meta: { total: number; page: number; limit: number; totalPages: number };
}

@Injectable({ providedIn: 'root' })
export class ArticleService {
  private base = `${environment.apiUrl}/articles`;

  constructor(private http: HttpClient) {}

  list(artistId?: number, page = 1, limit = 20): Observable<ArticleListResponse> {
    let params = new HttpParams().set('page', page).set('limit', limit);
    if (artistId) params = params.set('artistId', artistId);
    return this.http.get<ArticleListResponse>(this.base, { params });
  }

  getById(id: number): Observable<Article> {
    return this.http.get<Article>(`${this.base}/${id}`);
  }

  create(dto: CreateArticleDto): Observable<Article> {
    return this.http.post<Article>(this.base, dto);
  }

  update(id: number, dto: UpdateArticleDto): Observable<Article> {
    return this.http.put<Article>(`${this.base}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}