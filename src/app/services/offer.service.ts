import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Product } from '../models/product';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Bid } from '../models/bid';
import { isNullOrUndefined, isUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  userListing: Bid;
  productListing: Bid;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore
  ) { }

  async addOffer(pair: Product, condition: string, price: number, size: string) {
    let UID: string;
    await this.auth.isConnected()
      .then(data => {
        UID = data.uid;
      });

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
    }, { merge: true });

    // update highestBid in products Document
    return this.afs.collection('products').doc(`${pair.productID}`).get().subscribe(res => {
      const highestBid = res.data().highest_bid

      if (isNullOrUndefined(highestBid) || highestBid < price) {
        const prodRef = this.afs.firestore.collection('products').doc(`${pair.productID}`);

        batch.set(prodRef, {
          highest_bid: price
        }, { merge: true })
      }

      return batch.commit()
        .then(() => {
          //console.log('New Offer Added');
          return true;
        })
        .catch((err) => {
          console.error(err);
          return false;
        });
    })
  }

  public getOffer(offerID) {
    let UID: string;
    return this.auth.isConnected().then(data => {
      UID = data.uid;

      return this.afs.collection('users').doc(`${UID}`).collection('offers').doc(`${offerID}`).valueChanges()
    });
  }

  public async updateOffer(offer_id: string, product_id: string, old_price: number, condition: string, price: string, size: string): Promise<boolean> {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    const batch = this.afs.firestore.batch();

    const offerRef = this.afs.firestore.collection('users').doc(`${UID}`).collection('offers').doc(`${offer_id}`);
    const bidRef = this.afs.firestore.collection('products').doc(`${product_id}`).collection('offers').doc(`${offer_id}`);
    const prodRef = this.afs.firestore.collection(`products`).doc(`${product_id}`);

    let prices = [];

    await prodRef.collection(`offers`).orderBy(`price`, `desc`).limit(2).get().then(snap => {
      snap.forEach(ele => {
        prices.push(ele.data().price);
      });
    });

    if (prices.length === 1) {
      batch.update(prodRef, {
        highest_bid: price
      })
    } else {
      //console.log(`price1: ${prices[0]}; price2: ${prices[1]}; price: ${price}; old_price: ${old_price}`)
      if (price > prices[0]) {
        batch.update(prodRef, {
          highest_bid: price
        })
      } else if (old_price === prices[0] && price <= prices[1]) {
        batch.update(prodRef, {
          highest_bid: prices[1]
        })
      } else if (old_price === prices[0] && price > prices[1]) {
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
        console.log('Offer updated');
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }

  public async deleteoffer(offer_id: string, product_id: string, price: number) {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    const batch = this.afs.firestore.batch();

    const offerRef = this.afs.firestore.collection('users').doc(`${UID}`).collection('offers').doc(`${offer_id}`);
    const bidRef = this.afs.firestore.collection('products').doc(`${product_id}`).collection('offers').doc(`${offer_id}`);
    const userRef = this.afs.firestore.collection('users').doc(`${UID}`);

    batch.delete(offerRef);
    batch.delete(bidRef);
    batch.update(userRef, {
      offers: firebase.firestore.FieldValue.increment(-1)
    });

    let prices = []

    await this.afs.firestore.collection('products').doc(`${product_id}`).collection('offers').orderBy('price', 'desc').limit(2).get().then(snap => {
      snap.forEach(data => {
        prices.push(data.data().price)
      })
    })

    const prodRef = this.afs.firestore.collection('products').doc(`${product_id}`)

    if (prices.length === 1) {
      batch.update(prodRef, {
        highest_bid: firebase.firestore.FieldValue.delete()
      })
    } else if (price === prices[0] && prices[0] != prices[1]) {
      batch.update(prodRef, {
        highest_bid: prices[1]
      })
    }

    return batch.commit()
      .then(() => {
        console.log('Offer deleted');
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }
}
