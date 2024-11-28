import { Component, DestroyRef, inject } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  selectedText: string = 'My Account';

  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  ngOnInit(): void {
    const subscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        switch (event.urlAfterRedirects) {
          case '/account':
            this.selectedText = 'My Account';
            break;
          case '/':
            this.selectedText = 'Home';
            break;
          case '/favorite':
            this.selectedText = 'My favorite';
            break;
          default:
            this.selectedText = 'My Account';
        }
      }
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }

  updateText(text: string): void {
    this.selectedText = text;
  }
}
