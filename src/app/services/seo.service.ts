import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class SEOService {

  constructor(
    private meta: Meta,
    @Inject(DOCUMENT) private dom,
    private router: Router
  ) { }

  addTags(pageTitle: string, product?) {
    if (product === undefined) {
      this.meta.addTags([
        { name: `title`, content: `${pageTitle} | NXTDROP: Easiest & Safest Way To Buy and Sell Authentic Sneakers in Canada` },
        { name: `description`, content: 'Canada\'s only online sneaker marketplace. The easiest and safest way to buy and sell Jordan, Yeezy, Nike, adidas and all the hottest sneakers in Canada. All sneakers are 100% verified authentic and no duty fees. We take care of everything while you happily wait to receive your kicks or get paid.' },
        { name: `keywords`, content: 'stockx canada, goat canada, consignment canada, sneakers canada, deadstock, jordans, yeezys, adidas, nxtdrop, next drop' },
        { name: `og:title`, content: `${pageTitle} | NXTDROP: Easiest & Safest Way To Buy and Sell Authentic Sneakers in Canada` },
        { name: `og:url`, content: 'https://nxtdrop.com/' },
        { name: `og:image`, content: 'https://firebasestorage.googleapis.com/v0/b/nxtdrop.appspot.com/o/CarouselDuplicata3.png?alt=media&token=4b96304e-b8c9-4761-8154-bdf27591c4c5' },
        { name: `og:description`, content: 'Canada\'s only online sneaker marketplace. The easiest and safest way to buy and sell Jordan, Yeezy, Nike, adidas and all the hottest sneakers in Canada. All sneakers are 100% verified authentic and no duty fees. We take care of everything while you happily wait to receive your kicks or get paid.' },
        { name: `twitter:title`, content: `${pageTitle} | NXTDROP: Easiest & Safest Way To Buy and Sell Authentic Sneakers in Canada` },
        { name: `twitter:card`, content: 'summary_large_image' },
        { name: `twitter:image`, content: 'https://firebasestorage.googleapis.com/v0/b/nxtdrop.appspot.com/o/CarouselDuplicata3.png?alt=media&token=4b96304e-b8c9-4761-8154-bdf27591c4c5' },
        { name: `twitter:description`, content: 'Canada\'s only online sneaker marketplace. The easiest and safest way to buy and sell Jordan, Yeezy, Nike, adidas and all the hottest sneakers in Canada. All sneakers are 100% verified authentic and no duty fees. We take care of everything while you happily wait to receive your kicks or get paid.' }
      ], true);
    } else {
      this.meta.addTags([
        { name: 'title', content: `${product.model} | NXTDROP` },
        { name: 'description', content: `The easiest and safest way to buy and sell authentic ${product.model} and other ${product.brand} sneakers in Canada. No duty fees and 100% verified authentic. We take care of everything while you happily wait to receive your kicks or get paid.` },
        { name: 'keywords', content: `${product.model}, ${product.brand}, colorway ${product.colorway}, sneakers canada` },
        { name: 'og:title', content: `${product.model} | NXTDROP` },
        { name: 'og:url', content: `https://nxtdropcom/product/${product.productID}` },
        { name: 'og:image', content: `${product.assetURL}` },
        { name: 'og:description', content: `The easiest and safest way to buy and sell authentic ${product.model} and other ${product.brand} sneakers in Canada. No duty fees and 100% verified authentic. We take care of everything while you happily wait to receive your kicks or get paid.` },
        { name: 'twitter:title', content: `${product.model} | NXTDROP` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: `${product.assetURL}` },
        { name: 'twitter:description', content: `The easiest and safest way to buy and sell authentic ${product.model} and other ${product.brand} sneakers in Canada. No duty fees and 100% verified authentic. We take care of everything while you happily wait to receive your kicks or get paid.` }
      ], true);
    }
  }
  
  createCanonicalLink() {
    let link: HTMLLinkElement = this.dom.createElement('link');
    link.setAttribute('rel', 'canonical');
    this.dom.head.appendChild(link);
    link.setAttribute('href', `https://nxtdrop.com/${this.router.url}`);
  }
}
