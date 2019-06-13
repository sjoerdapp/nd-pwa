export class User {
    uid: number;
    fullName: string;
    username: string;
    email: string;
    lastConnected: Date;
    accountCreated: Date;
    country: string;
    stripeID: string;
    customerID: string;
    activeAccount: boolean;
    lastActivity: Date;
    blocked: boolean;

    /* Payment Properties */
    firstName?: string;
    lastName?: string;
    address?: string;
    outToken?: string;
    inToken?: string;
}