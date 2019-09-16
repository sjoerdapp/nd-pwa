import { Component, OnInit } from '@angular/core';
import { CheckoutService } from 'src/app/services/checkout.service';
import * as braintree from 'braintree-web';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  shippingInfo = {
    street: '',
    line: '',
    city: '',
    postalCode: '',
    province: '',
    country: '',
    firstName: '',
    lastName: ''
  };

  cartItems = [];

  shippingPrice = 0;
  tax = 0;

  constructor(
    private checkoutService: CheckoutService,
    private router: Router
  ) { }

  ngOnInit() {
    this.checkoutService.getCartItems().then(res => {
      res.subscribe(data => {
        this.cartItems = data;
      });
    });

    this.checkoutService.getShippingInfo().then(data => {
      this.shippingInfo = data;
    })
  }

  subtotal() {
    let subtotal = 0;
    this.cartItems.forEach(ele => {
      subtotal = subtotal + ele.price;
    });

    return subtotal;
  }

  editShipping() {
    this.router.navigate(['../settings/shipping'], {
      queryParams: { redirectURI: 'checkout' }
    });
  }

  editPayment() {
    this.router.navigate(['../settings/buying'], {
      queryParams: { redirectURI: 'checkout' }
    });
  }

  goToPay() {

  }

}
