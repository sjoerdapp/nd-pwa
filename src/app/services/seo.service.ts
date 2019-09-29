import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class SEOService {

  constructor(
    private meta: Meta
  ) { }

  addTags(product?) {
    if (product === undefined) {
      this.meta.addTags([
        {name: `title`, content: 'NXTDROP: Buy and Sell Authentic Sneakers in Canada'},
        {name: `description`, content: 'The first Canadian online sneaker marketplace. Buy and sell Yeezy, Nike, adidas and many more sneakers.'},
        {name: `keywords`, content: 'stockx, stock x, stockx canada, goat shoes, goat app, goat sneakers, running shoes, sneakers canada, buy shoes online, nxtdrop, nextdrop, next drop, deadstock sneakers, adidas yeezy, retro jordans, canada, resale, resell, marketplace, buy and sell authentic'},
        {name: `og:title`, content: 'NXTDROP: Buy and Sell Authentic Sneakers in Canada'},
        {name: `og:url`, content: 'https://nxtdrop.com/'},
        {name: `og:image`, content: 'https://firebasestorage.googleapis.com/v0/b/nxtdrop.appspot.com/o/CarouselDuplicata3.png?alt=media&token=4b96304e-b8c9-4761-8154-bdf27591c4c5'},
        {name: `og:description`, content: 'The first Canadian online sneaker marketplace. Buy and sell Yeezy, Nike, adidas and many more sneakers.'},
        {name: `twitter:title`, content: 'NXTDROP: Buy and Sell Authentic Sneakers in Canada'},
        {name: `twitter:card`, content: 'summary_large_image'},
        {name: `twitter:image`, content: 'https://firebasestorage.googleapis.com/v0/b/nxtdrop.appspot.com/o/CarouselDuplicata3.png?alt=media&token=4b96304e-b8c9-4761-8154-bdf27591c4c5'},
        {name: `twitter:description`, content: 'The first Canadian online sneaker marketplace. Buy and sell Yeezy, Nike, adidas and many more sneakers.'}
      ]);
    } else {
      this.meta.addTags([
        { name: 'title', content: `${product.model} - ${product.yearMade}` },
        { name: 'description', content: `Buy and sell authentic ${product.model} and other ${product.brand} sneakers.` },
        { name: 'keywords', content: `${product.model}, ${product.brand}, colorway ${product.colorway}` },
        { name: 'og:title', content: `${product.model}` },
        { name: 'og:url', content: `https://nxtdrop.com/product/${product.productID}` },
        { name: 'og:image', content: `${product.assetURL}` },
        { name: 'og:description', content: `Buy and sell authentic ${product.model} and other ${product.brand} sneakers.` },
        { name: 'twitter:title', content: `${product.model}` },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: `${product.assetURL}` },
        { name: 'twitter:description', content: `Buy and sell authentic ${product.model} and other ${product.brand} sneakers.` }
      ], true);
    }
  }
}
