export interface User {
    uid: string;
    email: string;
    listed: number;
    ordered: number;
    sold: number;
    offers: number;
    isActive: boolean;
    creation_date: number;

    // Optional
    username?: string;
    dob?: string
    freeShipping?: boolean;
    shippingAddress?: {
        selling?: {
            firstName: string,
            lastName: string,
            street: string,
            line2: string,
            city: string,
            province: string,
            postalCode: string,
            country: string
        },
        buying?: {
            firstName: string,
            lastName: string,
            street: string,
            line2: string,
            city: string,
            province: string,
            postalCode: string,
            country: string
        }
    }

    /* Payment Properties */
    firstName: string;
    lastName: string;
}
