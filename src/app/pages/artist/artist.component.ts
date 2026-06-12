import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ArtistService } from '../../core/services/artist.service';
import { ArticleService } from '../../core/services/article.service';
import { AuthService } from '../../core/services/auth.service';
import { Artist } from '../../core/models/artist.model';
import { Article } from '../../core/models/article.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-artist',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './artist.component.html',
  styleUrl: './artist.component.scss'
})
export class ArtistComponent implements OnInit {
  artist = signal<Artist | null>(null);
  articles = signal<Article[]>([]);
  activeArticle = signal<Article | null>(null);
  loading = signal(true);
  activeSection = signal('biography');
  comment = '';

  isLoggedIn = inject_signal(() => false);

  constructor(
    private route: ActivatedRoute,
    private artistService: ArtistService,
    private articleService: ArticleService,
    private sanitizer: DomSanitizer,
    private auth: AuthService
  ) {
    this.isLoggedIn = this.auth.isLoggedIn;
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.loadArtist(params['slug']);
    });
  }

  private loadArtist(slug: string): void {
    this.loading.set(true);
    this.artistService.getBySlug(slug).subscribe({
      next: artist => {
        this.artist.set(artist);
        if (artist.id) {
          this.articleService.list(artist.id).subscribe(res => {
            this.articles.set(res.data);
            if (res.data.length > 0) this.activeArticle.set(res.data[0]);
          });
        }
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  setSection(section: string): void {
    this.activeSection.set(section);
  }

  getSafeUrl(url: string): SafeResourceUrl {
    // Convert YouTube URLs to embed
    const embedUrl = url
      .replace('watch?v=', 'embed/')
      .replace('youtu.be/', 'www.youtube.com/embed/');
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  submitComment(): void {
    // Future: POST to comments endpoint
    console.log('Comment:', this.comment);
    this.comment = '';
  }

  get popularityLabel(): string {
    // Simulated popularity based on article count
    const count = this.artist()?.articles?.length ?? 0;
    if (count >= 10) return 'Muito conhecido';
    if (count >= 5)  return 'Em crescimento';
    if (count >= 2)  return 'Emergente';
    return 'Obscuro';
  }

  get popularityPercent(): number {
    const count = this.artist()?.articles?.length ?? 0;
    return Math.min(100, count * 10 + 10);
  }
}

function inject_signal<T>(fn: () => T): any { return fn; }
