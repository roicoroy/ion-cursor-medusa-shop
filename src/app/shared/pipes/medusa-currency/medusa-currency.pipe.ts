// https://nimishgoel056.medium.com/display-number-in-billion-million-thousand-using-custom-pipe-in-angular-b95bf388350a

import { Pipe, PipeTransform, inject } from '@angular/core';
import { Store } from '@ngxs/store';
import { RegionsState } from '../../../store/regions/regions.state';
import { ServerRegions, ServerRegionsSymbols } from '../../start/data-const';

@Pipe({
    name: 'medusaCurrency',
    standalone: true,
})
export class MedusaCurrency implements PipeTransform {
    private store = inject(Store);

    transform(value: any, currency_code?: string): string {
        // Get the current selected region
        const currentRegion = this.store.selectSnapshot(RegionsState.getDefaultRegion);
        const regionCurrency = currentRegion?.currency_code || 'usd';

        // Use the provided currency_code if available, otherwise use the region's currency
        const currencyToUse = currency_code || regionCurrency;

        let symbolValue: string;


        switch (currencyToUse.toLowerCase()) {
            case ServerRegions.unitedKingdom:
                symbolValue = `${ServerRegionsSymbols.unitedKingdom} ${value}`;
                break;
            case ServerRegions.europeMain:
                symbolValue = `${ServerRegionsSymbols.europeMain} ${value}`;
                break;
            case ServerRegions.northAmerica:
                symbolValue = `${ServerRegionsSymbols.northAmerica} ${value}`;
                break;
            case ServerRegions.southAmerica:
                symbolValue = `${ServerRegionsSymbols.southAmerica} ${value}`;
                break;
            default:
                // For unknown currencies, use the currency code
                symbolValue = `${currencyToUse.toUpperCase()} ${value}`;
                break;
        }

        return symbolValue;
    }
}
