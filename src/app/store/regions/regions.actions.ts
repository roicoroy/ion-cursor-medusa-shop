
export namespace RegionsActions {
    export class SetSelectedCountry {
        static readonly type = '[AddressesActions] Set Selected Coutry';
        constructor(public country: string) { }
    }
    export class ClearSelectedCoutry {
        static readonly type = '[AddressesActions] Clear Selected Coutry';
    }
    // 
    export class ClearCoutryList {
        static readonly type = '[AddressesActions] Clear Coutry List';
    }
    export class GetCountries {
        static readonly type = '[AddressesActions] Get Medusa Countries';
    }
    export class LogOut {
        static readonly type = '[AddressesActions] Logout';
    }
}
