export interface User {
    uid: string;
    email: string;
    listed: number;
    ordered: number;
    sold: number;
    counterOffer: number;

    // Optional
    username?: string;

    /* Payment Properties */
    firstName?: string;
    lastName?: string;
    address?: string;
    outToken?: string;
    inToken?: string;
}
