import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ProductService } from 'src/app/services/product.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  productID: string;

  productInfo = {};

  buyListings = [];
  offersListings = [];

  connected = false;

  showBuy = false;
  showOffers = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.productID = this.route.snapshot.params.id;
    this.isConnected();

    this.productService.getProductInfo(this.productID).subscribe(data => {
      this.productInfo = data;
    });
  }

  addToCart(listing) {
    this.productService.addToCart(listing).then(res => {
      if (res) {
        console.log('Added to cart');
      } else {
        console.log('Cannot add to cart');
      }
    });
  }

  isConnected() {
    return this.auth.checkStatus().then(res => {
      console.log(res);
      this.connected = res;
    });
  }

  navigationBuy() {
    document.getElementById('buy-btn').style.background = '#98fb98';
    document.getElementById('offers-btn').style.background = '#131e3a';

    this.showBuy = true;
    this.showOffers = false;
    if (this.buyListings.length < 1) {
      this.productService.getBuy(this.productID).subscribe(data => {
        this.buyListings = data;
        console.log(this.buyListings);
      });
    }
  }

  navigationOffers() {
    document.getElementById('buy-btn').style.background = '#131e3a';
    document.getElementById('offers-btn').style.background = '#98fb98';

    this.showBuy = false;
    this.showOffers = true;
    if (this.offersListings.length < 1) {
      this.productService.getOffers(this.productID).subscribe(data => {
        this.buyListings = data;
      });
    }
  }

}

// The Marketplacew Guy book
