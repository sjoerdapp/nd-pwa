import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {

  productID: string;

  productInfo = {};

  listings = [];

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) { }

  ngOnInit() {
    this.productID = this.route.snapshot.params.id;

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

}

// The Marketplacew Guy book
