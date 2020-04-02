import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Product } from '../models/product';
import { isNullOrUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class MetaService {

  constructor(
    private meta: Meta,
    @Inject(DOCUMENT) private dom,
    private router: Router
  ) { }

  addTags(pageTitle: string, product?: Product) {
    if (product === undefined) {
      this.meta.addTags([
        { name: `title`, content: `${pageTitle} | NXTDROP: Easiest & Safest Way To Buy and Sell Authentic Sneakers in Canada` },
        { name: `description`, content: 'Canada\'s only online sneaker marketplace. The easiest and safest way to buy and sell Jordan, Yeezy, Nike, adidas and all the hottest sneakers in Canada. All sneakers are 100% verified authentic and no duty fees. We take care of everything while you happily wait to receive your kicks or get paid.' },
        { name: `keywords`, content: 'stockx canada, goat canada, consignment canada, sneakers canada, deadstock, jordans, yeezys, adidas, nxtdrop, next drop' },
        { property: `og:title`, content: `${pageTitle} | NXTDROP: Easiest & Safest Way To Buy and Sell Authentic Sneakers in Canada` },
        { property: `og:url`, content: 'https://nxtdrop.com/' },
        { property: `og:image`, content: 'https://firebasestorage.googleapis.com/v0/b/nxtdrop.appspot.com/o/CarouselDuplicata3.png?alt=media&token=4b96304e-b8c9-4761-8154-bdf27591c4c5' },
        { property: `og:description`, content: 'Canada\'s only online sneaker marketplace. The easiest and safest way to buy and sell Jordan, Yeezy, Nike, adidas and all the hottest sneakers in Canada. All sneakers are 100% verified authentic and no duty fees. We take care of everything while you happily wait to receive your kicks or get paid.' },
        { property: `twitter:title`, content: `${pageTitle} | NXTDROP: Easiest & Safest Way To Buy and Sell Authentic Sneakers in Canada` },
        { property: `twitter:card`, content: 'summary_large_image' },
        { property: `twitter:image`, content: 'https://firebasestorage.googleapis.com/v0/b/nxtdrop.appspot.com/o/CarouselDuplicata3.png?alt=media&token=4b96304e-b8c9-4761-8154-bdf27591c4c5' },
        { property: `twitter:description`, content: 'Canada\'s only online sneaker marketplace. The easiest and safest way to buy and sell Jordan, Yeezy, Nike, adidas and all the hottest sneakers in Canada. All sneakers are 100% verified authentic and no duty fees. We take care of everything while you happily wait to receive your kicks or get paid.' }
      ], true);
    } else {
      this.meta.addTags([
        { name: 'title', content: `${product.model} | NXTDROP` },
        { name: 'description', content: `The easiest and safest way to buy and sell authentic ${product.model} and other ${product.brand} sneakers in Canada. No duty fees and 100% verified authentic. We take care of everything while you happily wait to receive your kicks or get paid.` },
        { name: 'keywords', content: `${product.model}, ${product.brand}, colorway ${product.colorway}, sneakers canada` },
        { property: 'og:title', content: `${product.model} | NXTDROP` },
        { property: 'og:url', content: `https://nxtdropcom/product/${product.productID}` },
        { property: 'og:image', content: `${product.assetURL}` },
        { property: 'og:description', content: `The easiest and safest way to buy and sell authentic ${product.model} and other ${product.brand} sneakers in Canada. No duty fees and 100% verified authentic. We take care of everything while you happily wait to receive your kicks or get paid.` },
        { property: 'twitter:title', content: `${product.model} | NXTDROP` },
        { property: 'twitter:card', content: 'summary_large_image' },
        { property: 'twitter:image', content: `${product.assetURL}` },
        { property: 'twitter:description', content: `The easiest and safest way to buy and sell authentic ${product.model} and other ${product.brand} sneakers in Canada. No duty fees and 100% verified authentic. We take care of everything while you happily wait to receive your kicks or get paid.` }
      ], true);

      if (!isNullOrUndefined(product.lowestPrice)) {
        this.meta.addTags([
          { property: 'product:brand', content: `${product.brand}` },
          { property: 'product:availability', content: 'in stock' },
          { property: 'product:condition', content: 'new' },
          { property: 'product:price:amount', content: `${product.lowestPrice}` },
          { property: 'product:price:currency', content: 'CAD' },
          { property: 'product:retailer_item_id', content: `${product.productID}` },
          { property: 'product:item_group_id', content: `${product.type}` }
        ])
      }
    }
  }

  createCanonicalLink() {
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', `https://nxtdrop.com/${this.router.url}`);
  }
}
