import { Component, EventEmitter, Input, Output } from '@angular/core';

import { ButtonComponent } from '../../../share/button/button.component';
import { Movie } from '../../../models/movie.model';

@Component({
  selector: 'app-favorite-item',
  standalone: true,
  imports: [ButtonComponent],
  templateUrl: './favorite-item.component.html',
  styleUrl: './favorite-item.component.scss',
})
export class FavoriteItemComponent {
  @Input() movie!: Movie;
  @Output() onRemove: EventEmitter<Event> = new EventEmitter<Event>();


  removeFavorite() {
    this.onRemove.emit();
  }
}
