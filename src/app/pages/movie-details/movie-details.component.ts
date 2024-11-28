import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie.model';
import { ButtonComponent } from '../../share/button/button.component';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-movie-details',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './movie-details.component.html',
  styleUrl: './movie-details.component.scss',
})
export class MovieDetailsComponent implements OnInit {
  movieId!: number;
  movie?: Movie;
  error = '';
  isFetching = false;
  movies: Movie[] = [];
  isAddedToFavorite = false;

  private activatedRoute = inject(ActivatedRoute);
  private moviesService = inject(MoviesService);
  private storageService = inject(StorageService);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  get posterUrl(): string {
    return `https://image.tmdb.org/t/p/w342${this.movie?.poster_path}`;
  }

  get backgroundUrl(): string {
    return `https://image.tmdb.org/t/p/w780${this.movie?.backdrop_path}`;
  }

  ngOnInit(): void {
    this.movies = this.storageService.getMovies();
    this.movieId = +this.activatedRoute.snapshot.params['id'];
    this.isFetching = true;
    const subscription = this.moviesService
      .getMovieById(this.movieId)
      .subscribe({
        next: (val) => {
         this.movie = val;
          this.error = '';
        },
        error: (err: Error) => {
          this.error = err.message;
          this.movie = null as any;
        },

        complete: () => (this.isFetching = false),
      });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  get isLastMovie(): boolean {
    return this.movies[this.movies.length - 1].id === this.movie?.id;
  }
  get isFirstMovie(): boolean {
    return this.movies[0]?.id === this.movie?.id;
  }

  get isMovieInList(): boolean {
    return this.movies.some((movie) => movie.id === this.movie?.id);
  }

  get showNextButton(): boolean {
    return this.movies.length > 1 && this.isMovieInList;
  }

  get showBackButton(): boolean {
    return this.movies.length < 1 || this.isFirstMovie || !this.isMovieInList;
  }

  getNextMovie(): void {
    if (this.isLastMovie) {
      this.router.navigate(['']);
    } else {
      const currentIndex = this.movies.findIndex(
        (movie) => movie.id === this.movie?.id
      );

      if (currentIndex === -1 || currentIndex >= this.movies.length - 1) {
        return;
      }

      const nextMovie = this.movies[currentIndex + 1];
      this.router.navigate(['/movie', nextMovie.id]);
      this.movie = nextMovie;
    }
  }

  getPreviousMovie(): void {
    if (this.isFirstMovie || !this.isMovieInList) {
      this.router.navigate(['']);
    } else {
      const currentIndex = this.movies.findIndex(
        (movie) => movie.id === this.movie?.id
      );

      if (currentIndex === 0 || currentIndex === -1) {
        return;
      }

      const previousMovie = this.movies[currentIndex - 1];
      this.router.navigate(['/movie', previousMovie.id]);
      this.movie = previousMovie;
    }
  }

  addToFavorite() {
    if (this.movie) this.storageService.addOrRemoveMovie(this.movie);
    this.movies = this.storageService.getMovies();
  }
}
