import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {

  cartItems = [];

  subtotal = 0;

  constructor(
    private cartService: CartService
  ) { }

  ngOnInit() {
    this.cartService.getCartItems().then(res => {
      res.subscribe(data => {
        this.cartItems = data;
        this.calculateSubtotal(data);
      });
    });
  }

  calculateSubtotal(data) {
    this.subtotal = 0;
    data.forEach(ele => {
      this.subtotal = this.subtotal + ele.price;
    });
  }

  removeFromCart(ID: string) {
    this.cartService.removeFromCart(ID);
  }

}
