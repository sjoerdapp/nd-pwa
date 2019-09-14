import { Component, OnInit } from '@angular/core';
import { CheckoutService } from 'src/app/services/checkout.service';
import * as braintree from 'braintree-web';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  cartItems;

  shipping = 0;
  tax = 0;

  hostedFieldsInstance: braintree.HostedFields;
  cardholdersName: string;

  constructor(
    private checkoutService: CheckoutService
  ) { }

  ngOnInit() {
    this.checkoutService.getCartItems().then(res => {
      res.subscribe(data => {
        this.cartItems = data;
      });
    });
  }

  subtotal() {
    let subtotal = 0;
    this.cartItems.forEach(ele => {
      subtotal = subtotal + ele.price;
    });

    return subtotal;
  }

}
