import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../models/product';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import { isUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class SellService {

  userListing;
  productListing;

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) { }

  async addListing(pair: Product, condition: string, price: number, size: string) {
    let UID: string;
    await this.auth.isConnected()
      .then(data => {
        UID = data.uid;
      });

    const timestamp = Date.now();

    const listingID = UID + '-' + timestamp;

    this.userListing = {
      assetURL: pair.assetURL,
      model: pair.model,
      price,
      condition,
      size,
      productID: pair.productID,
      listingID,
      timestamp,
      sellerID: UID
    };

    this.productListing = {
      assetURL: pair.assetURL,
      model: pair.model,
      price,
      condition,
      size,
      listingID,
      timestamp,
      sellerID: UID
    };

    const batch = this.afs.firestore.batch();
    console.log(timestamp);

    const userDocRef = this.afs.firestore.collection(`users/${UID}/listings`).doc(`${listingID}`);
    const prodDocRef = this.afs.firestore.collection(`products/${pair.productID}/listings`).doc(`${listingID}`);
    const listedValRef = this.afs.firestore.doc(`users/${UID}`);

    batch.set(userDocRef, this.userListing); // add Listing to User Document
    batch.set(prodDocRef, this.productListing); // add Listing to Products Document
    batch.set(listedValRef, {
      listed: firebase.firestore.FieldValue.increment(1)
    }, { merge: true }); // increment 'listed' field by one

    // update lowestprice in Product Document
    return this.afs.collection(`products`).doc(`${pair.productID}`).get().subscribe(res => {
      const lowestPrice = res.data().lowestPrice
      if (isUndefined(lowestPrice) || lowestPrice > price) {
        const productRef = this.afs.firestore.collection(`products`).doc(`${pair.productID}`);
        batch.set(productRef, {
          lowestPrice: price
        }, { merge: true });
      }

      return batch.commit()
        .then(() => {
          console.log('New Listing Added');
          return true;
        })
        .catch((err) => {
          console.error(err);
          return false;
        });
    });
  }

  /*async getLowestPrice(productID: string) {
    const prodRef = await this.afs.collection(`products`).doc(`${productID}`);
    return prodRef.get();
  }*/

  getHighestOffer(productID: string, condition: string, size: string) {
    const offerRef = this.afs.collection(`products`).doc(`${productID}`).collection(`offers`, ref => ref.where(`condition`, `==`, `${condition}`).where(`size`, `==`, `${size}`).orderBy(`price`, `desc`).limit(1));
    return offerRef.get();
  }

  getLowestListing(productID: string, condition: string, size: string) {
    const listingRef = this.afs.collection(`products`).doc(`${productID}`).collection(`listings`, ref => ref.where(`condition`, `==`, `${condition}`).where(`size`, `==`, `${size}`).orderBy(`price`, `asc`).limit(1));
    return listingRef.get();
  }

}
