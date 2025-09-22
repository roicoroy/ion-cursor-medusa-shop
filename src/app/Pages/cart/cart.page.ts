import { Component } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { MedusaCartComponent } from '../../components/medusa-cart/medusa-cart/medusa-cart.component';
import { RegionSelectComponent } from '../../components/region-select/region-select.component';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [IonicModule, MedusaCartComponent, RegionSelectComponent]
})
export class CartPage {
  // The MedusaCartComponent handles all cart functionality
  // This page now serves as a simple wrapper with the header
} 