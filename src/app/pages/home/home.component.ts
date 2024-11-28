import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { Router } from '@angular/router';

import { MoviesService } from '../../services/movies.service';
import { Movie } from '../../models/movie.model';
import { ContainerComponent } from '../../share/container/container.component';
import { CustomPaginationComponent } from '../../components/custom-pagination/custom-pagination.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    ContainerComponent,
    NgxPaginationModule,
    CustomPaginationComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit {
  movies: Movie[] = [];
  isFetching = false;
  error = '';
  p: number = 1;
  totalItems: number = 1160;

  private moviesService = inject(MoviesService);
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  ngOnInit(): void {
    this.fetchMovies(this.p);
  }

  fetchMovies(page: number): void {
    this.isFetching = true;
    const subscription = this.moviesService.getMovies(page).subscribe({
      next: (data) => {
        this.movies = data;
      },
      error: (err: Error) => (this.error = err.message),
      complete: () => (this.isFetching = false),
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  pageChanged(page: number): void {
    this.movies = [];
    this.p = page;
    this.fetchMovies(page);
  }

  navigateToMovieDetails(movieId: number) {
    this.router.navigate(['/movie', movieId]);
  }
}
