import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';
import { Title } from '@angular/platform-browser';
import { Product } from 'src/app/models/product';
import { isUndefined } from 'util';

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

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private auth: AuthService,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    this.productID = this.route.snapshot.params.id;
    this.isConnected();

    this.productService.getProductInfo(this.productID).subscribe(data => {
      if (isUndefined(data)) {
        this.router.navigate([`page-not-found`]);
      } else {
        this.productInfo = data;
        this.title.setTitle(`${this.productInfo.model} - ${this.productInfo.brand} | NXTDROP`);
      }
    });
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

  buyNow(listing) {
    const data = JSON.stringify(listing);
    this.router.navigate([`../../checkout`], {
      queryParams: { product: data, sell: false }
    });
  }

  sell(offer) {
    const data = JSON.stringify(offer);
    this.router.navigate([`../../checkout`], {
      queryParams: { product: data, sell: true }
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

}

// The Marketplacew Guy book
