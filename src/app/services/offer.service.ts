import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Product } from '../models/product';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Bid } from '../models/bid';
import { isNullOrUndefined, isUndefined } from 'util';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  userListing: Bid;
  productListing: Bid;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore,
    private http: HttpClient,
    private router: Router
  ) { }

  async addOffer(pair: Product, condition: string, price: number, size: string, size_highest_bid: number) {
    let UID: string;
    await this.auth.isConnected()
      .then(data => {
        if (!isNullOrUndefined(data)) {
          UID = data.uid;
        } else {
          this.router.navigate(['/login'], {
            queryParams: {
              redirectTo: this.router.url
            }
          })
        }
      })

    const timestamp = Date.now();
    const offerID = UID + '-' + timestamp;

    this.userListing = {
      assetURL: pair.assetURL,
      model: pair.model,
      price,
      condition,
      size,
      productID: pair.productID,
      offerID,
      timestamp,
      buyerID: UID
    };

    this.productListing = {
      assetURL: pair.assetURL,
      model: pair.model,
      price,
      condition,
      size,
      offerID,
      timestamp,
      productID: pair.productID,
      buyerID: UID
    };

    const batch = this.afs.firestore.batch();

    const userDocRef = this.afs.firestore.collection(`users/${UID}/offers`).doc(`${offerID}`);
    const prodDocRef = this.afs.firestore.collection(`products/${pair.productID}/offers`).doc(`${offerID}`);
    const offersValRef = this.afs.firestore.doc(`users/${UID}`);

    batch.set(userDocRef, this.userListing);
    batch.set(prodDocRef, this.productListing);
    batch.set(offersValRef, {
      offers: firebase.firestore.FieldValue.increment(1)
    }, { merge: true })

    // update highestBid in products Document
    return this.afs.collection('products').doc(`${pair.productID}`).get().subscribe(res => {
      if (isNullOrUndefined(res.data().highest_bid) || res.data().highest_bid < price) {
        const prodRef = this.afs.firestore.collection('products').doc(`${pair.productID}`);

        batch.set(prodRef, {
          highest_bid: price
        }, { merge: true })
      }

      return batch.commit()
        .then(() => {
          //console.log('New Offer Added');

          console.log(`size highest_bid: ${size_highest_bid} and price: ${price}`)

          if (!isNullOrUndefined(size_highest_bid) && price > size_highest_bid) {
            this.http.put(`${environment.cloud.url}highestBidNotification`, {
              product_id: pair.productID,
              buyer_id: UID,
              condition,
              size,
              offer_id: offerID,
              price
            }).subscribe()
          }

          return true;
        })
        .catch((err) => {
          console.error(err);
          return false;
        })
    })
  }

  public getOffer(offerID) {
    let UID: string;
    return this.auth.isConnected().then(data => {
      UID = data.uid;

      return this.afs.collection('users').doc(`${UID}`).collection('offers').doc(`${offerID}`).get()
    });
  }

  public async updateOffer(offer_id: string, product_id: string, old_price: number, condition: string, price: number, size: string): Promise<boolean> {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    const batch = this.afs.firestore.batch();

    const offerRef = this.afs.firestore.collection('users').doc(`${UID}`).collection('offers').doc(`${offer_id}`);
    const bidRef = this.afs.firestore.collection('products').doc(`${product_id}`).collection('offers').doc(`${offer_id}`);
    const prodRef = this.afs.firestore.collection(`products`).doc(`${product_id}`);

    let prices: Bid[] = []
    let size_prices: Bid[] = []

    await prodRef.collection(`offers`).orderBy(`price`, `desc`).limit(2).get().then(snap => {
      snap.forEach(ele => {
        prices.push(ele.data().price);
      });
    });

    await prodRef.collection(`offers`).where('size', '==', `${size}`).where('condition', '==', `${condition}`).orderBy(`price`, `desc`).limit(2).get().then(snap => {
      snap.forEach(ele => {
        size_prices.push(ele.data() as Bid);
      })
    })

    if (prices.length === 1) {
      batch.update(prodRef, {
        highest_bid: price
      })
    } else {
      //console.log(`price1: ${prices[0]}; price2: ${prices[1]}; price: ${price}; old_price: ${old_price}`)
      if (price > prices[0].price) {
        batch.update(prodRef, {
          highest_bid: price
        })
      } else if (old_price === prices[0].price && price <= prices[1].price) {
        batch.update(prodRef, {
          highest_bid: prices[1].price
        })
      } else if (old_price === prices[0].price && price > prices[1].price) {
        batch.update(prodRef, {
          highest_bid: price
        })
      }
    }

    batch.update(offerRef, {
      condition: condition,
      price: price,
      size: size
    });

    batch.update(bidRef, {
      condition: condition,
      price: price,
      size: size
    });

    return batch.commit()
      .then(() => {
        //console.log('Offer updated');
        this.sendHighestBidNotification(price, condition, size, UID, product_id, offer_id, size_prices)
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }

  public async deleteoffer(bid: Bid) {
    const batch = this.afs.firestore.batch();

    const offerRef = this.afs.firestore.collection('users').doc(`${bid.buyerID}`).collection('offers').doc(`${bid.offerID}`);
    const bidRef = this.afs.firestore.collection('products').doc(`${bid.productID}`).collection('offers').doc(`${bid.offerID}`);
    const userRef = this.afs.firestore.collection('users').doc(`${bid.buyerID}`);
    const prodRef = this.afs.firestore.collection('products').doc(`${bid.productID}`)

    batch.delete(offerRef);
    batch.delete(bidRef);
    batch.update(userRef, {
      offers: firebase.firestore.FieldValue.increment(-1)
    });

    let prices: Bid[] = []
    let size_prices: Bid[] = []

    await prodRef.collection('offers').orderBy('price', 'desc').limit(2).get().then(snap => {
      snap.forEach(data => {
        prices.push(data.data().price)
      })
    })

    await prodRef.collection(`offers`).where('size', '==', `${bid.size}`).where('condition', '==', `${bid.condition}`).orderBy(`price`, `desc`).limit(2).get().then(snap => {
      snap.forEach(ele => {
        size_prices.push(ele.data() as Bid);
      })
    })

    if (prices.length === 1) {
      batch.update(prodRef, {
        highest_bid: firebase.firestore.FieldValue.delete()
      })
    } else if (bid.price === prices[0].price && prices[0].price != prices[1].price) {
      batch.update(prodRef, {
        highest_bid: prices[1].price
      })
    }

    return batch.commit()
      .then(() => {
        //console.log('Offer deleted');
        console.log(`offerID: ${bid.offerID}; size[0]: ${size_prices[0].offerID}`)
        console.log(`size[1]: ${size_prices[1]}`)

        if (bid.offerID === size_prices[0].offerID && !isNullOrUndefined(size_prices[1])) {
          console.log(size_prices[1])
          this.http.put(`${environment.cloud.url}highestBidNotification`, {
            product_id: size_prices[1].productID,
            buyer_id: size_prices[1].buyerID,
            condition: size_prices[1].condition,
            size: size_prices[1].size,
            offer_id: size_prices[1].offerID,
            price: size_prices[1].price
          }).subscribe()
        }

        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }

  sendHighestBidNotification(price: number, condition: string, size: string, UID: string, product_id: string, offer_id: string, size_prices: Bid[]) {
    if (price > size_prices[0].price) {
      this.http.put(`${environment.cloud.url}highestBidNotification`, {
        product_id,
        buyer_id: UID,
        condition,
        size,
        offer_id,
        price
      }).subscribe()
    } else if (!isNullOrUndefined(size_prices[1]) && offer_id === size_prices[0].offerID && price < size_prices[0].price) {
      if (price <= size_prices[1].price) {
        this.http.put(`${environment.cloud.url}highestBidNotification`, {
          product_id,
          buyer_id: size_prices[1].buyerID,
          condition,
          size,
          offer_id: size_prices[1].offerID,
          price: size_prices[1].price
        }).subscribe()
      } else if (price > size_prices[1].price) {
        this.http.put(`${environment.cloud.url}highestBidNotification`, {
          product_id,
          buyer_id: UID,
          condition,
          size,
          offer_id,
          price
        }).subscribe()
      }
    } else if (isNullOrUndefined(size_prices[1])) {
      this.http.put(`${environment.cloud.url}highestBidNotification`, {
        product_id,
        buyer_id: UID,
        condition,
        size,
        offer_id,
        price
      }).subscribe()
    }
  }
}
