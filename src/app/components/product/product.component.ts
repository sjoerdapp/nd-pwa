import { Component, OnInit, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { Title } from '@angular/platform-browser';
import { Product } from 'src/app/models/product';
import { isUndefined } from 'util';
import { ModalService } from 'src/app/services/modal.service';
import { SEOService } from 'src/app/services/seo.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  productID: string;

  productInfo: Product = {
    assetURL: '',
    model: '',
    line: '',
    brand: '',
    yearMade: '',
    type: '',
    productID: '',
    colorway: ''
  };

  buyListings = [];
  offersListings = [];

  connected = false;

  showBuy = false;
  showOffers = false;

  modalTimeout;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private auth: AuthService,
    private router: Router,
    private title: Title,
    private modalService: ModalService,
    private seo: SEOService,
    private ngZone: NgZone,
    @Inject(PLATFORM_ID) private platform_id: Object
  ) { }

  ngOnInit() {
    this.productID = this.route.snapshot.params.id;
    this.isConnected();

    this.productService.getProductInfo(this.productID).subscribe(data => {
      if (isUndefined(data)) {
        this.router.navigate([`page-not-found`]);
      } else {
        this.seo.addTags('Product', data);
        this.productInfo = data;
        this.title.setTitle(`${this.productInfo.model} - ${this.productInfo.brand} | NXTDROP`);
      }
    });

    this.countView();
  }

  /*addToCart(listing) {
    this.productService.addToCart(listing).then(res => {
      if (res) {
        // console.log('Added to cart');
      } else {
        // console.log('Cannot add to cart');
      }
    });
  }*/

  countView() {
    this.productService.countView(this.productID).catch(err => {
      console.error(err);
    })
  }

  buyNow(listing) {
    const data = JSON.stringify(listing);
    clearTimeout(this.modalTimeout);
    this.ngZone.run(() => {
      this.router.navigate([`../../checkout`], {
        queryParams: { product: data, sell: false }
      });
    });
  }

  sell(offer) {
    const data = JSON.stringify(offer);
    this.ngZone.run(() => {
      this.router.navigate([`../../checkout`], {
        queryParams: { product: data, sell: true }
      });
    });
  }

  isConnected() {
    return this.auth.checkStatus().then(res => {
      // console.log(res);
      this.connected = res;
    });
  }

  navigationBuy() {
    document.getElementById('buy-btn').style.background = '#383637';
    document.getElementById('offers-btn').style.background = '#222021';

    this.showBuy = true;
    this.showOffers = false;
    if (this.buyListings.length < 1) {
      this.productService.getBuy(this.productID).subscribe(data => {
        this.buyListings = data;
        // console.log(this.buyListings);
        this.modalTimeout = setTimeout(() => {
          this.getModalCookie();
        }, 5000);
      });
    }
  }

  navigationOffers() {
    document.getElementById('buy-btn').style.background = '#222021';
    document.getElementById('offers-btn').style.background = '#383637';

    this.showBuy = false;
    this.showOffers = true;
    if (this.offersListings.length < 1) {
      this.productService.getOffers(this.productID).subscribe(data => {
        this.offersListings = data;
      });
    }
  }

  private getModalCookie() {
    const cookies = document.cookie.split(`;`);
    cookies.forEach(element => {
      element.split(`=`);

      if (document.cookie.replace(/(?:(?:^|.*;\s*)modalOffer\s*\=\s*([^;]*).*$)|^.*$/, "$1") !== "true") {
        this.modalService.openModal('makeOffer');
        this.modalService.placeOffer(this.productInfo);
        const expr = new Date(new Date().getTime() + 60 * 60000 * 24).toUTCString();
        document.cookie = `modalOffer=true; expires=${expr}; path=/product/`
      }
    });
  }

  share(social: string) {
    if (isPlatformBrowser(this.platform_id)) {
      if (social === 'fb') {
        window.open(`https://www.facebook.com/sharer/sharer.php?app_id=316718239101883&u=https://nxtdrop.com/product/${this.productID}&display=popup&ref=plugin`, 'popup', 'width=600,height=600,scrollbars=no,resizable=no');
        return false;
      } else if (social === 'twitter') {
        window.open(`https://twitter.com/intent/tweet?text=Check out the ${this.productInfo.model} available on @nxtdrop https://nxtdrop.com/product/${this.productID}`, 'popup', 'width=600,height=600,scrollbars=no,resizable=no');
        return false;
      } else {
        return false;
      }
    }
  }

}
