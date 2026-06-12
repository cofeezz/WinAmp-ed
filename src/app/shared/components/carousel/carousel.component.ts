import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Artist } from '../../../core/models/artist.model';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="carousel-stage">
      <!-- Row 1: left to right -->
      <div class="carousel-row row-1">
        <div class="carousel-track track-forward">
          @for (artist of doubledArtists; track $index) {
            <a class="carousel-item" [routerLink]="['/artist', artist.slug]">
              @if (artist.imageUrl) {
                <img [src]="artist.imageUrl" [alt]="artist.name" loading="lazy" />
              } @else {
                <div class="carousel-item__fallback">{{ artist.name.charAt(0) }}</div>
              }
              <div class="carousel-item__label">
                <span class="carousel-item__name">{{ artist.name }}</span>
                <span class="carousel-item__genre">{{ artist.genre }}</span>
              </div>
            </a>
          }
        </div>
      </div>

      <!-- Row 2: right to left -->
      <div class="carousel-row row-2">
        <div class="carousel-track track-backward">
          @for (artist of doubledArtistsReversed; track $index) {
            <a class="carousel-item" [routerLink]="['/artist', artist.slug]">
              @if (artist.imageUrl) {
                <img [src]="artist.imageUrl" [alt]="artist.name" loading="lazy" />
              } @else {
                <div class="carousel-item__fallback">{{ artist.name.charAt(0) }}</div>
              }
              <div class="carousel-item__label">
                <span class="carousel-item__name">{{ artist.name }}</span>
                <span class="carousel-item__genre">{{ artist.genre }}</span>
              </div>
            </a>
          }
        </div>
      </div>

      <!-- Row 3: left to right (slower) -->
      <div class="carousel-row row-3">
        <div class="carousel-track track-forward-slow">
          @for (artist of doubledArtists; track $index) {
            <a class="carousel-item carousel-item--sm" [routerLink]="['/artist', artist.slug]">
              @if (artist.imageUrl) {
                <img [src]="artist.imageUrl" [alt]="artist.name" loading="lazy" />
              } @else {
                <div class="carousel-item__fallback">{{ artist.name.charAt(0) }}</div>
              }
              <div class="carousel-item__label">
                <span class="carousel-item__name">{{ artist.name }}</span>
              </div>
            </a>
          }
        </div>
      </div>

      <!-- Diagonal mask overlay -->
      <div class="carousel-mask-left"></div>
      <div class="carousel-mask-right"></div>
    </div>
  `,
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  @Input({ required: true }) artists: Artist[] = [];

  get doubledArtists(): Artist[] {
    return [...this.artists, ...this.artists];
  }

  get doubledArtistsReversed(): Artist[] {
    return [...this.artists].reverse().concat([...this.artists].reverse());
  }
}
