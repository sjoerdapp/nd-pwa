import { Component, OnInit } from '@angular/core';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { AuthService } from 'src/app/services/auth.service';
import { isNullOrUndefined, isBoolean, isUndefined, isNull } from 'util';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';

declare var gtag: any;

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
  isSelling: any;

  constructor(
    private checkoutService: CheckoutService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private title: Title
  ) { }

  ngOnInit() {
    /*this.auth.isConnected().then(res => {
      if (isNullOrUndefined(res.phoneNumber)) {
        this.router.navigate(['../phone-verification']);
      }
    });*/

    this.title.setTitle(`Checkout | NXTDROP: Sell and Buy Sneakers in Canada`);

    this.product = JSON.parse(this.route.snapshot.queryParams.product);

    gtag('event', 'begin_checkout', {
      'event_category': 'ecommerce',
      'event_label': this.product.model
    });

    this.isSelling = this.route.snapshot.queryParams.sell;
    console.log(this.isSelling);

    if (!isUndefined(this.isSelling)) {
      if (this.isSelling != 'true') {
        this.isSelling = false;
        this.initConfig();
      } else {
        this.isSelling = true;
      }
    } else {
      this.router.navigate([`..`]);
    }

    this.auth.isConnected().then(res => {
      if (isNull(res)) {
        this.router.navigate([`login`]);
      }

      if (isNullOrUndefined(res.phoneNumber)) {
        if (this.route.snapshot.queryParams.product) {
          this.router.navigate(['../phone-verification'], {
            queryParams: { redirectTo: `product/${this.product.model.replace(/\s/g, '-').replace(/["'()]/g, '').replace(/\//g, '-').toLowerCase()}` }
          });
        }
      }
    });


    // console.log(this.product);

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
      clientId: environment.payPal.apiKey,
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
        this.checkoutService.transactionApproved(this.product, data.id, this.shippingPrice).then(res => {
          gtag('event', 'purchase', {
            'event_category': 'ecommerce',
            'event_label': this.product.type,
            'event_value': this.product.price + this.shippingPrice
          });
          if (isBoolean(res)) {
            this.router.navigate(['transaction']);
          } else {
            this.router.navigate(['transaction'], {
              queryParams: { transactionID: res }
            });
          }
        })
          .catch(err => {
            console.error(err);
          });
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

  sellNow() {
    this.checkoutService.sellTransactionApproved(this.product).then(res => {
      gtag('event', 'item_sold', {
        'event_category': 'ecommerce',
        'event_label': this.product.type,
        'event_value': this.product.price + this.shippingPrice
      });
      if (isBoolean(res)) {
        this.router.navigate(['sold']);
      } else {
        this.router.navigate(['sold'], {
          queryParams: { transactionID: res }
        });
      }
    })
      .catch(err => {
        console.error(err);
      });
  }

  subtotal() {
    let subtotal = this.product.price;
    /*this.cartItems.forEach(ele => {
      subtotal = subtotal + ele.price;
    });*/

    return subtotal;
  }

  fee() {
    let subtotal = this.subtotal();

    return subtotal * 0.095;
  }

  processing() {
    let subtotal = this.subtotal();

    return subtotal * 0.03;
  }

  goBack() {
    const id = this.product.model.toLowerCase();
    this.router.navigate([`product/${id.replace(/\s/g, '-').replace(/["'()]/g, '').replace(/\//g, '-')}`]);
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
}
