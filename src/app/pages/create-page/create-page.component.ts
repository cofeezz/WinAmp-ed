import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ArtistService } from '../../core/services/artist.service';
import { ArticleService } from '../../core/services/article.service';
import { Artist } from '../../core/models/artist.model';

@Component({
  selector: 'app-create-page',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './create-page.component.html',
  styleUrl: './create-page.component.scss'
})
export class CreatePageComponent implements OnInit {
  step = signal(1); // 1=artist, 2=content
  artists = signal<Artist[]>([]);
  selectedArtist = signal<Artist | null>(null);

  artistForm: FormGroup;
  contentForm: FormGroup;
  loading = signal(false);
  error = signal('');
  success = signal(false);
  isNewArtist = signal(false);

  genres = [
    'Lo-fi', 'Shoegaze', 'Post-punk', 'Noise rock', 'Ambient', 'Drone',
    'Experimental', 'Folk alternativo', 'Math rock', 'Emo', 'Post-rock',
    'Indie folk', 'Grunge', 'Dream pop', 'Darkwave', 'Industrial',
    'Vaporwave', 'Hyperpop', 'J-pop underground', 'Midwest emo', 'Outro'
  ];

  constructor(
    private fb: FormBuilder,
    private artistService: ArtistService,
    private articleService: ArticleService,
    private router: Router
  ) {
    this.artistForm = this.fb.group({
      artistId: [''],
      newArtistName: [''],
      newArtistGenre: [''],
      newArtistOrigin: [''],
      newArtistBio: [''],
      newArtistImage: ['']
    });

    this.contentForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      tags: [''],
      videoUrls: [''],
      externalLinks: ['']
    });
  }

  ngOnInit(): void {
    this.artistService.list({ limit: 100 }).subscribe(res => {
      this.artists.set(res.data);
    });
  }

  selectArtist(artist: Artist): void {
    this.selectedArtist.set(artist);
    this.isNewArtist.set(false);
  }

  toggleNewArtist(): void {
    this.isNewArtist.set(!this.isNewArtist());
    this.selectedArtist.set(null);
  }

  goToContent(): void {
    if (!this.selectedArtist() && !this.isNewArtist()) {
      this.error.set('Selecione um artista ou crie um novo.');
      return;
    }
    this.error.set('');

    if (this.isNewArtist()) {
      const name = this.artistForm.value.newArtistName;
      if (!name) { this.error.set('Nome do artista é obrigatório.'); return; }
      this.loading.set(true);
      this.artistService.create({
        name,
        genre: this.artistForm.value.newArtistGenre,
        origin: this.artistForm.value.newArtistOrigin,
        bio: this.artistForm.value.newArtistBio,
        imageUrl: this.artistForm.value.newArtistImage
      }).subscribe({
        next: artist => {
          this.selectedArtist.set(artist);
          this.loading.set(false);
          this.step.set(2);
        },
        error: err => {
          this.error.set(err.error?.error || 'Erro ao criar artista.');
          this.loading.set(false);
        }
      });
    } else {
      this.step.set(2);
    }
  }

  submit(): void {
    if (this.contentForm.invalid || !this.selectedArtist()) return;
    this.loading.set(true);

    this.articleService.create({
      title: this.contentForm.value.title,
      content: this.contentForm.value.content,
      artistId: this.selectedArtist()!.id
    }).subscribe({
      next: () => {
        this.success.set(true);
        setTimeout(() => this.router.navigate(['/artist', this.selectedArtist()!.slug]), 1500);
      },
      error: err => {
        this.error.set(err.error?.error || 'Erro ao publicar.');
        this.loading.set(false);
      }
    });
  }
}
