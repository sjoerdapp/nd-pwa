export interface User {
    uid: string;
    email: string;
    listed: number;
    ordered: number;
    sold: number;
    offers: number;
    isActive: boolean;

    // Optional
    username?: string;
    dob? : string
    freeShipping?: boolean;

    /* Payment Properties */
    firstName?: string;
    lastName?: string;
    shippingAddress?: {
        line1: string;
        line2: string;
        city: string;
        province: string;
        postalCode: string;
        country: string;
    }
}
