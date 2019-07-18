export interface User {
    uid: string;
    email: string;

    // Optional
    username?: string;

    /* Payment Properties */
    firstName?: string;
    lastName?: string;
    address?: string;
    outToken?: string;
    inToken?: string;
}
