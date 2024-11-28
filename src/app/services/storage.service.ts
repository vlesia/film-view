import { Injectable } from '@angular/core';

import { Movie } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storageKey = 'movies';

  addOrRemoveMovie(movie: Movie): void {
    const movies = this.getMovies();
    const movieIndex = movies.findIndex((m) => m.id === movie.id);

    if (movieIndex === -1) {
      movies.unshift(movie);
    } else {
      movies.splice(movieIndex, 1);
    }
    localStorage.setItem(this.storageKey, JSON.stringify(movies));
  }

  getMovies(): Movie[] {
    const storedMovies = localStorage.getItem(this.storageKey);
    return storedMovies ? JSON.parse(storedMovies) : [];
  }

  removeMovie(movieId: number): void {
    const movies = this.getMovies().filter((movie) => movie.id !== movieId);
    localStorage.setItem(this.storageKey, JSON.stringify(movies));
  }
}
