import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Product } from '../models/product';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  userListing;
  productListing;

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
    const listingID = UID + '-' + timestamp;

    this.userListing = {
      assetURL: pair.assetURL,
      model: pair.model,
      price,
      condition,
      size,
      productID: pair.productID,
      listingID,
      timestamp
    };

    this.productListing = {
      assetURL: pair.assetURL,
      model: pair.model,
      price,
      condition,
      size,
      listingID,
      timestamp
    };

    const batch = this.afs.firestore.batch();

    const userDocRef = this.afs.firestore.collection(`users/${UID}/offers`).doc(`${listingID}`);
    const prodDocRef = this.afs.firestore.collection(`products/${pair.productID}/offers`).doc(`${listingID}`);
    const offersValRef = this.afs.firestore.doc(`users/${UID}`);

    batch.set(userDocRef, this.userListing);
    batch.set(prodDocRef, this.productListing);
    batch.set(offersValRef, {
      offers: firebase.firestore.FieldValue.increment(1)
    }, { merge: true });

    return batch.commit()
      .then(() => {
        console.log('New Offer Added');
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }
}
