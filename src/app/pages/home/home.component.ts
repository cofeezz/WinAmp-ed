import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ArtistService } from '../../core/services/artist.service';
import { Artist } from '../../core/models/artist.model';
import { CarouselComponent } from '../../shared/components/carousel/carousel.component';
import { SearchBarComponent } from '../../shared/components/search-bar/search-bar.component';
import { ArtistCardComponent } from '../../shared/components/artist-card/artist-card.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CarouselComponent, SearchBarComponent, ArtistCardComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  artists = signal<Artist[]>([]);
  recentArtists = signal<Artist[]>([]);
  loading = signal(true);

  constructor(private artistService: ArtistService) {}

  ngOnInit(): void {
    this.artistService.list({ limit: 30 }).subscribe({
      next: res => {
        this.artists.set(res.data);
        this.recentArtists.set(res.data.slice(0, 8));
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}
