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

  listings = [];

  connected = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.productID = this.route.snapshot.params.id;
    this.isConnected();

    this.productService.getOffers(this.productID).subscribe(data => {
      this.listings = data;
    });

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

}

// The Marketplacew Guy book
