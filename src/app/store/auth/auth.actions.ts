import { LoginPayload, RegisterPayload, ICustomerDetails } from "../../shared/interfaces";
import { MedusaAddress } from "../../shared/interfaces/medusa-address";

export namespace AuthActions {
    export class Login {
        static readonly type = '[AuthActions] Login';
        constructor(public loginPayload: LoginPayload) { }
    }
    export class Register {
        static readonly type = '[AuthActions] Register Customer';
        constructor(public registerPayload: RegisterPayload | any, public medusaAddress: MedusaAddress) { }
    }
    
    export class GetSession {
        static readonly type = '[AuthStateActions] Get Medusa Session';
    }
    
    export class AddACustomerAddress {
        static readonly type = '[CustomerActions] Add a Cusomter Address to customer';
        constructor(public address: MedusaAddress) { }
    }
    export class UpdateCustomerAddress {
        static readonly type = '[CustomerActions] Update Customer Address';
        constructor(public addressId: string, public address: any) { }
    }
    export class DeleteCustomerAddress {
        static readonly type = '[CustomerActions] Delete Customer Address';
        constructor(public addressId: string) { }
    }
    export class SetDefaultCustomerBillingAddress {
        static readonly type = '[CartActions]Set Default Customer Billing Address';
        constructor(public addressId: string, public value: boolean) { }
    }
    export class SetDefaultCustomerShippingAddress {
        static readonly type = '[CartActions] Set Default Customer Shipping Address';
        constructor(public addressId: string, public value: boolean) { }
    }
    export class ValidateGoogleCallback {
        static readonly type = '[CartActions] Validate LoginGoogle Callback';
        constructor(public code: string, public state: string) { }
    }
    export class CreateGoogleUser {
        static readonly type = '[AuthActions] Create Google User';
        constructor(public registerPayload: RegisterPayload | any, public medusaAddress: MedusaAddress) { }
    }
    export class UpdateCustomerDetails {
        static readonly type = '[AuthActions] Update Customer Details';
        constructor(public payload: ICustomerDetails) { }
    }
    export class AuthLogout {
        static readonly type = '[AuthActions] AuthLogout';
    }
}