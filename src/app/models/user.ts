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

    /* Payment Properties */
    firstName?: string;
    lastName?: string;
    address?: string;
    outToken?: string;
    inToken?: string;
}
