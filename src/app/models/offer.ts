import { Product } from './product';
import { User } from './user';

export class Offer {
    offerID: number;
    product: Product;
    seller: User;
    condition: string;
    price: number;
    size: number;
    date: Date;
}