import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnInit } from '@angular/core';
import { IonChip, IonButton, IonIcon, IonSpinner } from '@ionic/angular/standalone';
import { MedusaProduct } from 'src/app/shared/interfaces/customer-product.interface';
import { PriceViewComponent } from "../../price-view/price-view.component";

@Component({
  selector: 'app-medusa-product-details-wrapper',
  templateUrl: './medusa-product-details-wrapper.component.html',
  styleUrls: ['./medusa-product-details-wrapper.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonChip,
    IonButton,
    IonIcon,
    IonSpinner,
    PriceViewComponent
  ]
})
export class MedusaProductDetailsWrapperComponent implements OnInit {

  @Input() medusaProduct: MedusaProduct | null = null;
  textMore: boolean = false;

  ngOnInit(): void {
    // Component initialization
  }

  handleTextToggle(): void {
    this.textMore = !this.textMore;
  }

  // For future cart integration, inject a cart service or use Output events

  getShortDescription(): string {
    if (!this.medusaProduct?.description) {
      return '';
    }

    const desc = this.medusaProduct.description;
    if (this.textMore) return desc;
    return desc.length > 120 ? desc.slice(0, 120) + '...' : desc;
  }

  // Helper method to check if product has required data
  hasProductData(): boolean {
    return this.medusaProduct !== null && this.medusaProduct !== undefined;
  }
}
