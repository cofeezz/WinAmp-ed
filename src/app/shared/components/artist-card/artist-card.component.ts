import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Artist } from '../../../core/models/artist.model';

@Component({
  selector: 'app-artist-card',
  standalone: true,
  imports: [RouterLink],
  template: `
    <a class="artist-card" [routerLink]="['/artist', artist.slug]">
      <div class="artist-card__image">
        @if (artist.imageUrl) {
          <img [src]="artist.imageUrl" [alt]="artist.name" loading="lazy" />
        } @else {
          <div class="artist-card__placeholder">
            <span>{{ artist.name.charAt(0) }}</span>
          </div>
        }
        <div class="artist-card__overlay"></div>
      </div>
      <div class="artist-card__info">
        <h3 class="artist-card__name">{{ artist.name }}</h3>
        @if (artist.genre) {
          <p class="artist-card__genre">{{ artist.genre }}</p>
        }
        @if (artist.origin) {
          <p class="artist-card__origin">{{ artist.origin }}</p>
        }
      </div>
      <div class="artist-card__glow"></div>
    </a>
  `,
  styleUrl: './artist-card.component.scss'
})
export class ArtistCardComponent {
  @Input({ required: true }) artist!: Artist;
}
