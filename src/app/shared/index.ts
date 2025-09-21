import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
  imports: [
    CommonModule,
  ],
  exports: [
    CommonModule,
  ]
})
export class SharedModule { }

// Export other shared components and services as needed
export * from './api/medusa.service';
export * from './interfaces'; 