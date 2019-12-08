export class Transaction {
    assetURL: string;
    boughtAt?: number;
    soldAt?: number;
    buyerID: string;
    condition: string;
    listedAt: number;
    listingID?: string;
    offerID?: string;
    model: string;
    paymentID: string;
    price: number;
    productID: string;
    sellerID: string;
    shippingCost?: number;
    discount?: number;
    total: number;
    size: string;
    status: Object;
    type: string;
}