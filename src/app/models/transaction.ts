import { User } from './user';
import { Offer } from './offer';

export class Transaction {
    transactionID: number;
    product: Offer;
    buyer: User;
    total: number;
    shippingAddress: string;
    status: string;
    purchaseDate: Date;
    confirmationDate?: Date;
    verificationDate?: Date;
    chargeID: string;
    chargeDate?: Date;
    cancellationDate?: Date;
    cancelledBy?: User;

    /** Shipping Properties */
    shippingID?: number;
    shipCost?: number;
    shipCarrier?: string;
    shipTracking?: string;
}