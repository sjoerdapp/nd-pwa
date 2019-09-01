import { Injectable } from '@angular/core';
import { CartService } from './cart.service';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private cartService: CartService
  ) { }

  getCartItems() {
    return this.cartService.getCartItems();
  }
}
