import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContainerComponent } from '../../share/container/container.component';
import { FavoriteItemComponent } from './favorite-item/favorite-item.component';
import { Movie } from '../../models/movie.model';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-favorite-list',
  standalone: true,
  imports: [CommonModule, ContainerComponent, FavoriteItemComponent],
  templateUrl: './favorite-list.component.html',
  styleUrl: './favorite-list.component.scss',
})
export class FavoriteListComponent implements OnInit {
  movies: Movie[] = [];

  private storageService = inject(StorageService);

  ngOnInit(): void {
    this.loadMovies();
  }

  removeMovie(movie: Movie) {
    this.storageService.removeMovie(movie.id);
    this.loadMovies();
  }
  loadMovies() {
    this.movies = this.storageService.getMovies();
  }
}
