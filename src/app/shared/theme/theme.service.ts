import { inject, Injectable } from '@angular/core';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';
import { Store } from '@ngxs/store';

export const DARK_MODE = 'dark_mode';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  public darkMode: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  public darkModeIcon: BehaviorSubject<string> = new BehaviorSubject<string>('');

  private store = inject(Store);

  private document = inject(DOCUMENT);

  themeInit() {
    const isDarkMode = this.store.selectSnapshot<any>((state: any) => state.theme.isDarkMode);
    if (isDarkMode) {
      this.document.documentElement.classList.toggle('ion-palette-dark', true);
      this.darkMode.next(true);
      this.darkModeIcon.next('moon');
    } else {
      this.document.documentElement.classList.toggle('ion-palette-dark', false);
      this.darkMode.next(false);
      this.darkModeIcon.next('sunny');
    }
  }
}
