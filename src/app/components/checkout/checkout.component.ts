import { Component, OnInit, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { CheckoutService } from 'src/app/services/checkout.service';
import { Router, ActivatedRoute } from '@angular/router';
import { IPayPalConfig, ICreateOrderRequest } from 'ngx-paypal';
import { AuthService } from 'src/app/services/auth.service';
import { isNullOrUndefined, isBoolean, isUndefined, isNull } from 'util';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';
import { SEOService } from 'src/app/services/seo.service';

declare const gtag: any;

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

  product: any = {}
  shippingPrice = 18;
  subtotal = 0;
  total = 0;
  discount = 0;
  discountCardID: string;

  tax = 0;
  isSelling: any;

  user: any;

  // User Checking out item sold to them
  tID;

  // Promo variables
  promoError = false;
  promoApplied = false;
  promoLoading = false;

  constructor(
    private checkoutService: CheckoutService,
    private router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private title: Title,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.tID = this.route.snapshot.queryParams.tID;
    this.title.setTitle(`Checkout | NXTDROP: Sell and Buy Sneakers in Canada`);
    this.seo.addTags('Checkout');

    this.isSelling = this.route.snapshot.queryParams.sell;

    if (!isUndefined(this.isSelling) && !isUndefined(this.route.snapshot.queryParams.product)) {
      this.product = JSON.parse(this.route.snapshot.queryParams.product);
      this.subtotal = this.product.price;

      if (isPlatformBrowser(this._platformId)) {
        gtag('event', 'begin_checkout', {
          'event_category': 'ecommerce',
          'event_label': this.product.model
        });
      }

      if (this.isSelling != 'true') {
        this.isSelling = false;
        this.checkFreeShipping();
        this.initConfig();
      } else {
        this.isSelling = true;
      }
    } else {
      if (isUndefined(this.tID)) {
        this.router.navigate([`..`]);
      }
    }

    this.auth.isConnected().then(res => {
      if (isNull(res)) {
        this.router.navigate([`login`], {
          queryParams: { redirectTo: this.router.url }
        });
      } else {
        this.user = res;

        if (!isUndefined(this.tID)) {
          this.checkUserAndTransaction(this.user, this.tID);
        } else {
          if (isNullOrUndefined(res.phoneNumber) && this.route.snapshot.queryParams.product && this.isSelling && this.user.email !== 'momarcisse0@gmail.com') {
            this.router.navigate(['../phone-verification'], {
              queryParams: { redirectTo: `product/${this.product.model.replace(/\s/g, '-').replace(/["'()]/g, '').replace(/\//g, '-').toLowerCase()}` }
            });
          }
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
            value: (this.total).toString(),
            breakdown: {
              item_total: {
                currency_code: 'CAD',
                value: (this.total).toString()
              }
            }
          },
          items: [{
            name: this.product.model,
            quantity: '1',
            category: 'PHYSICAL_GOODS',
            unit_amount: {
              currency_code: 'CAD',
              value: (this.total).toString(),
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
        //console.log('onApprove - transaction was approved, but not authorized', data, actions);
        actions.order.get().then(details => {
          //console.log('onApprove - you can get full order details inside onApprove: ', details);
        });
      },
      onClientAuthorization: (data) => {
        //console.log('onClientAuthorization - you should probably inform your server about completed transaction at this point', data);
        let transaction;

        if (isUndefined(this.tID)) {
          if (this.promoApplied) {
            transaction = this.checkoutService.transactionApproved(this.product, data.id, this.shippingPrice, this.discount, this.discountCardID);
          } else {
            transaction = this.checkoutService.transactionApproved(this.product, data.id, this.shippingPrice);
          }
        } else {
          if (this.promoApplied) {
            transaction = this.checkoutService.addTransaction(this.product, data.id, this.shippingPrice, this.discount, this.discountCardID);
          } else {
            transaction = this.checkoutService.addTransaction(this.product, data.id, this.shippingPrice);
          }
        }
        transaction.then(res => {
          if (isPlatformBrowser(this._platformId)) {
            gtag('event', 'purchase', {
              'event_category': 'ecommerce',
              'event_label': this.product.type,
              'event_value': this.product.price + this.shippingPrice
            });
          }

          if (isBoolean(res)) {
            this.ngZone.run(() => {
              this.router.navigate(['transaction']);
            });
          } else {
            this.ngZone.run(() => {
              this.router.navigate(['transaction'], {
                queryParams: { transactionID: res }
              });
            });
          }
        })
          .catch(err => {
            console.error(err);
          });
      },
      onCancel: (data, actions) => {
        //console.log('OnCancel', data, actions);

      },
      onError: err => {
        //console.log('OnError', err);
      },
      onClick: (data, actions) => {
        //console.log('onClick', data, actions);
        gtag('event', 'PP_click', {
          'event_category': 'ecommerce',
          'event_label': this.product.model
        });
      },
    };
  }

  applyPromo() {
    const code = (document.getElementById('promo-code') as HTMLInputElement).value;
    const now = Date.now();

    if (code.length == 10) {
      this.promoLoading = true;
      this.checkoutService.getPromoCode(code).then(res => {
        if (res.exists && res.data().amount != 0 && res.data().expirationDate > now) {
          if (this.total <= res.data().amount) {
            this.total = 0;
            this.discount = this.total;
          } else {
            this.total = this.total - res.data().amount;
            this.discount = res.data().amount;
          }

          this.promoLoading = false;
          this.promoApplied = true;
          this.discountCardID = code;
        } else {
          this.promoLoading = false;
          this.promoError = true;

          setTimeout(() => {
            this.promoError = false;
          }, 2000);
        }
      }).catch(err => {
        console.error(err);
        this.promoLoading = false;
        this.promoError = true;

        setTimeout(() => {
          this.promoError = false;
        }, 2000);
      })
    }
  }

  private checkFreeShipping() {
    this.checkoutService.getFreeShipping().then(res => {
      res.subscribe(response => {
        //console.log(response);
        if (!isUndefined(response.data().freeShipping) || response.data().ordered === 0) {
          this.shippingPrice = 0;
        }

        this.total = this.subtotal + this.shippingPrice;
      })
    });
  }

  checkUserAndTransaction(user, transactionID: string) {
    this.checkoutService.checkTransaction(user, transactionID).then(res => {
      if (res) {
        this.checkoutService.getTransaction(transactionID).subscribe(response => {
          this.product = response;
          this.subtotal = this.product.price;
          this.checkFreeShipping();
          this.initConfig();
        })
      } else {
        this.router.navigate(['page-not-found']);
      }
    })
  }

  sellNow() {
    this.checkoutService.sellTransactionApproved(this.product).then(res => {
      if (isPlatformBrowser(this._platformId)) {
        gtag('event', 'item_sold', {
          'event_category': 'ecommerce',
          'event_label': this.product.type,
          'event_value': this.product.price + this.shippingPrice
        });
      }

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
        this.router.navigate(['sold']);
      });
  }

  fee() {
    let subtotal = this.subtotal;

    return subtotal * 0.095;
  }

  processing() {
    let subtotal = this.subtotal;

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
