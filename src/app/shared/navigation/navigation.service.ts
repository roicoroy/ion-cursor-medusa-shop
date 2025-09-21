import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private router = inject(Router);

  navigateTo(path: string | any[], extras: any = {}) {
    return this.router.navigate(Array.isArray(path) ? path : [path], extras);
  }

  navigateByUrl(url: string, extras: any = {}) {
    return this.router.navigateByUrl(url, extras);
  }

  // Example: navigation with animation or custom logic
  navigateFlip(path: string, extras: any = {}) {
    // Add animation logic here if needed
    return this.navigateTo(path, extras);
  }

  // Example: navigation with params
  navigateWithParams(path: string, params: any) {
    return this.router.navigate([path], { queryParams: params });
  }

  // Go back
  goBack() {
    window.history.back();
  }
}

export const fade = trigger('fade', [
  transition(':enter', [
    style({ opacity: 0 }),
    animate('350ms ease-out', style({ opacity: 1 }))
  ]),
  transition(':leave', [
    animate('350ms ease-out', style({ opacity: 0 }))
  ])
]);

export const slideUp = trigger('slideUp', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(10%)' }),
    animate('200ms ease-in', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ opacity: 0, transform: 'translateY(10%)' }))
  ])
]);

// New: Bounce animation
export const bounce = trigger('bounce', [
  transition(':enter', [
    style({ transform: 'scale(0.5)', opacity: 0 }),
    animate('300ms cubic-bezier(.68,-0.55,.27,1.55)', style({ transform: 'scale(1)', opacity: 1 }))
  ]),
  transition(':leave', [
    animate('200ms ease-in', style({ transform: 'scale(0.5)', opacity: 0 }))
  ])
]);

export const fadeSlide = trigger('fadeSlide', [
  transition(':enter', [
    style({ opacity: 0, transform: 'translateY(20px)' }),
    animate('300ms cubic-bezier(.4,0,.2,1)', style({ opacity: 1, transform: 'translateY(0)' }))
  ]),
  transition(':leave', [
    animate('200ms cubic-bezier(.4,0,.2,1)', style({ opacity: 0, transform: 'translateY(20px)' }))
  ])
]);
