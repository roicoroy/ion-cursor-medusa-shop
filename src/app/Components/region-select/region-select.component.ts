import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { IonicModule, IonPopover } from '@ionic/angular';
import { Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { RegionsActions } from '../../store/regions/regions.actions';
import { RegionsState } from '../../store/regions/regions.state';
import { NewCountryListModel } from '../../store/regions/regions.state';

@Component({
  selector: 'app-region-select',
  templateUrl: './region-select.component.html',
  styleUrls: ['./region-select.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ]
})
export class RegionSelectComponent {
  @ViewChild('regionPopover') regionPopover!: IonPopover;
  
  private store = inject(Store);

  // Observables for region data
  currentRegion$: Observable<NewCountryListModel> = this.store.select(RegionsState.getDefaultRegion);
  regionList$: Observable<NewCountryListModel[]> = this.store.select(RegionsState.getRegionList);

  constructor() {
    // Load regions if not already loaded
    this.loadRegions();
  }

  loadRegions() {
    this.store.dispatch(new RegionsActions.GetCountries());
  }

  changeRegion(region: NewCountryListModel) {
    this.store.dispatch(new RegionsActions.SetSelectedCountry(region.country));
  }

  presentRegionPopover() {
    this.regionPopover.present();
  }

  getCurrencySymbol(currencyCode: string): string {
    switch (currencyCode.toLowerCase()) {
      case 'gbp':
        return '£';
      case 'eur':
        return '€';
      case 'usd':
        return '$';
      case 'brl':
        return 'R$';
      default:
        return currencyCode.toUpperCase();
    }
  }
} 