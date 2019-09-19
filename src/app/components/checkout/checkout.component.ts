import { Component, OnInit } from '@angular/core';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {

  public payPalConfig?: IPayPalConfig;

  /*shippingInfo = {
    street: '',
    line: '',
    city: '',
    postalCode: '',
    province: '',
    country: '',
    firstName: '',
    lastName: ''
  };*/

  // cartItems = [];

  product;
  shippingPrice = 18;
  tax = 0;

  constructor(
    private checkoutService: CheckoutService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.product = JSON.parse(this.route.snapshot.queryParams.product);
    // console.log(this.product);

    this.initConfig();

    /*this.checkoutService.getCartItems().then(res => {
      res.subscribe(data => {
        this.cartItems = data;
      });
    });

    this.checkoutService.getShippingInfo().then(data => {
      this.shippingInfo = data;
    })*/
  }

  private initConfig() {
    this.payPalConfig = {
      currency: 'CAD',
      clientId: 'AQW2Qq1TY5a6Tfcq7HKpnMrF7cpNeCskm4frrbBC8eFcbNFL2FUUkmRcoBb-8I0ijAt2Y4yTiipaSRSz',
      createOrderOnClient: (data) => <ICreateOrderRequest>{
        intent: 'CAPTURE',
        purchase_units: [{
          amount: {
            currency_code: 'CAD',
            value: this.subtotal() + this.tax + this.shippingPrice,
            breakdown: {
              item_total: {
                currency_code: 'CAD',
                value: this.subtotal() + this.tax + this.shippingPrice
              }
            }
          },
          items: [{
            name: this.product.model,
            quantity: '1',
            category: 'PHYSICAL_GOODS',
            unit_amount: {
              currency_code: 'CAD',
              value: this.subtotal() + this.tax + this.shippingPrice,
            },
          }]
        }]
      },
      advanced: {
        commit: 'true'
      },
      style: {
        label: 'paypal',
        layout: 'vertical',
        color: 'silver',
        shape: 'rect',
        tagline: false
      },
      onApprove: (data, actions) => {
        console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
      },
      onCancel: (data, actions) => {
        console.log('OnCancel', data, actions);

      },
      onError: err => {
        console.log('OnError', err);
      },
      onClick: (data, actions) => {
        console.log('onClick', data, actions);
      },
    };
  }

  subtotal() {
    let subtotal = this.product.price;
    /*this.cartItems.forEach(ele => {
      subtotal = subtotal + ele.price;
    });*/

    return subtotal;
  }

  goBack() {
    const id = this.product.model.toLowerCase();
    this.router.navigate([`../product/${id.replace(/ /g, '-')}`]);
  }

  /*editShipping() {
    this.router.navigate(['../settings/shipping'], {
      queryParams: { redirectURI: 'checkout' }
    });
  }

  editPayment() {
    this.router.navigate(['../settings/buying'], {
      queryParams: { redirectURI: 'checkout' }
    });
  }*/

  goToPay() {

  }

}
