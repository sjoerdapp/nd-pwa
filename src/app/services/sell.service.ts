import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Product } from '../models/product';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';

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
        timestamp
      };

      this.productListing = {
        sellerID: UID,
        price,
        condition,
        size,
        listingID,
        timestamp
      };

      const batch = this.afs.firestore.batch();
      console.log(timestamp);

      const userDocRef = this.afs.firestore.collection(`users/${UID}/listings`).doc(`${listingID}`);
      const prodDocRef = this.afs.firestore.collection(`products/${pair.productID}/listings`).doc(`${listingID}`);
      const listedValRef = this.afs.firestore.doc(`users/${UID}`);

      batch.set(userDocRef, this.userListing);
      batch.set(prodDocRef, this.productListing);
      batch.update(listedValRef, {
        listed: firebase.firestore.FieldValue.increment(1)
      });

      batch.commit()
        .then(() => {
          console.log('New Listing Added');
        })
        .catch((err) => {
          console.error(err);
        });
    }

}
