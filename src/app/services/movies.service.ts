import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { Movie, MoviesResponse } from '../models/movie.model';

@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  private URL = 'https://api.themoviedb.org/3/movie/';
  private API_KEY = 'ebea8cfca72fdff8d2624ad7bbf78e4c';

  private httpClient = inject(HttpClient);

  getMovies(page: number) {
    return this.httpClient
      .get<MoviesResponse>(
        `${this.URL}popular?api_key=${this.API_KEY}&page=${page}`
      )
      .pipe(
        map((resData) => resData.results),
        catchError((error) => {
          return throwError(
            () =>
              new Error(
                'Something went wrong fetching data. Please try again later.'
              )
          );
        })
      );
  }

  getMovieById(movieId: number): Observable<Movie> {
    return this.httpClient
      .get<Movie>(`${this.URL}${movieId}?api_key=${this.API_KEY}`)
      .pipe(
        catchError((error) => {
          return throwError(
            () =>
              new Error(
                'Something went wrong fetching data. Please try next movie.'
              )
          );
        })
      );
  }
}
