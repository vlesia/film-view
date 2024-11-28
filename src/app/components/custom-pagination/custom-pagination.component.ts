import { NgFor, NgIf } from '@angular/common';
import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-custom-pagination',
  standalone: true,
  imports: [NgxPaginationModule, NgFor, NgIf],
  templateUrl: './custom-pagination.component.html',
  styleUrl: './custom-pagination.component.scss',
})
export class CustomPaginationComponent implements OnInit {
  isSmallScreen: boolean = false;

  @Input() id: string = '';
  @Input() maxSize: number = 2;
  @Input() itemsPerPage: number = 20;
  @Input() totalItems: number = 1160;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageBoundsCorrection = new EventEmitter<number>();

  ngOnInit(): void {
    this.updateScreenSize();
  }

  @HostListener('window:resize', [])
  onResize(): void {
    this.updateScreenSize();
  }

  private updateScreenSize(): void {
    this.isSmallScreen = window.innerWidth < 576;
  }

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): { value: number; label: string }[] {
    if (this.isSmallScreen) {
      return [{ value: this.currentPage, label: this.currentPage.toString() }];
    }
    const pages = [];
    let visiblePageCount = this.currentPage + this.maxSize;
    let visiblePageCountReversed = this.currentPage - this.maxSize;
    if (this.currentPage === this.totalPages) {
      pages.unshift({
        value: this.currentPage,
        label: this.currentPage.toString(),
      });
      pages.unshift({
        value: this.currentPage - 1,
        label: (this.currentPage - 1).toString(),
      });
    } else if (this.currentPage >= 50) {
      for (let i = this.currentPage; i >= visiblePageCountReversed; i--) {
        pages.unshift({ value: i, label: i.toString() });
        if (visiblePageCountReversed === i) {
          pages.unshift({ value: i - 3, label: '...' });
        }
      }
    } else {
      for (let i = this.currentPage; i <= visiblePageCount; i++) {
        pages.push({ value: i, label: i.toString() });
        if (visiblePageCount === i) {
          pages.push({ value: i + 3, label: '...' });
        }
      }
    }

    return pages;
  }

  isFirstPage(): boolean {
    return this.currentPage === 1;
  }

  isLastPage(): boolean {
    return this.currentPage === this.totalPages;
  }

  previous(): void {
    if (!this.isFirstPage()) {
      this.currentPage--;
      this.pageChange.emit(this.currentPage);
    }
  }

  next(): void {
    if (!this.isLastPage()) {
      this.currentPage++;
      this.pageChange.emit(this.currentPage);
    }
  }

  setCurrent(page: number): void {
    this.currentPage = page;
    this.pageChange.emit(this.currentPage);
  }

  goToFirst(): void {
    if (!this.isFirstPage()) {
      this.currentPage = 1;
      this.pageChange.emit(this.currentPage);
    }
  }

  goToLast(): void {
    if (!this.isLastPage()) {
      this.currentPage = this.totalPages;
      this.pageChange.emit(this.currentPage);
    }
  }
}
