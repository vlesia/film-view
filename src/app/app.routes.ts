import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { MovieDetailsComponent } from './pages/movie-details/movie-details.component';
import { FavoriteListComponent } from './pages/favorite-list/favorite-list.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, title: 'Home' },
  { path: 'movie/:id', component: MovieDetailsComponent, title: 'Movie' },
  { path: 'favorite', component: FavoriteListComponent, title: 'My favorite' },
  { path: '**', redirectTo: '' }
];
