import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  public isSearchOpen: boolean = false;

  /**
   * Handle search open/close
   */
  handleSearchOpen(): void {
    this.isSearchOpen = !this.isSearchOpen;
  }

  /**
   * Close search
   */
  closeSearch(): void {
    this.isSearchOpen = false;
  }
} 