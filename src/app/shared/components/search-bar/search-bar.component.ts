import { Component, EventEmitter, Output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { ArtistService } from '../../../core/services/artist.service';
import { Artist } from '../../../core/models/artist.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="search-wrap" [class.focused]="isFocused">
      <div class="search-bar">
        <span class="search-bar__icon">⌕</span>
        <input
          type="text"
          [(ngModel)]="query"
          (ngModelChange)="onQuery($event)"
          (focus)="isFocused = true"
          (blur)="onBlur()"
          placeholder="Pesquise um artista underground..."
          class="search-bar__input"
          autocomplete="off"
        />
        @if (query) {
          <button class="search-bar__clear" (click)="clear()">×</button>
        }
      </div>

      <!-- Results dropdown -->
      @if (isFocused && results().length > 0) {
        <div class="search-results">
          @for (artist of results(); track artist.id) {
            <a class="search-result" [routerLink]="['/artist', artist.slug]" (click)="clear()">
              @if (artist.imageUrl) {
                <img [src]="artist.imageUrl" [alt]="artist.name" />
              } @else {
                <div class="search-result__avatar">{{ artist.name.charAt(0) }}</div>
              }
              <div class="search-result__info">
                <span class="search-result__name">{{ artist.name }}</span>
                @if (artist.genre) {
                  <span class="search-result__genre">{{ artist.genre }}</span>
                }
              </div>
            </a>
          }
        </div>
      }

      @if (isFocused && query && results().length === 0 && !loading()) {
        <div class="search-results search-results--empty">
          <p>Nenhum artista encontrado para "<em>{{ query }}</em>"</p>
          <a routerLink="/create" (click)="clear()">Seja o primeiro a criar uma página ›</a>
        </div>
      }
    </div>
  `,
  styleUrl: './search-bar.component.scss'
})
export class SearchBarComponent {
  query = '';
  isFocused = false;
  results = signal<Artist[]>([]);
  loading = signal(false);

  private search$ = new Subject<string>();

  constructor(private artistService: ArtistService) {
    this.search$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(q => {
        if (!q.trim()) { this.results.set([]); return []; }
        this.loading.set(true);
        return this.artistService.list({ search: q, limit: 6 });
      })
    ).subscribe({
      next: res => {
        if (res && 'data' in res) this.results.set(res.data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  onQuery(value: string): void {
    this.search$.next(value);
  }

  onBlur(): void {
    setTimeout(() => this.isFocused = false, 200);
  }

  clear(): void {
    this.query = '';
    this.results.set([]);
    this.isFocused = false;
  }
}
