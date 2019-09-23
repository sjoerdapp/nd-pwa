import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { isUndefined } from 'util';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) { }

  public async getUserData(): Promise<Observable<User>> {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${UID}`);
    return userRef.valueChanges();
  }

  public async getUserListings(startAfter?): Promise<Observable<any>> {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    let userRef: AngularFirestoreCollection<any>;

    if (isUndefined(startAfter)) {
      // tslint:disable-next-line: max-line-length
      userRef = this.afs.collection(`users`).doc(`${UID}`).collection(`listings`, ref => ref.orderBy('size', 'asc').limit(6));
    } else {
      // tslint:disable-next-line: max-line-length
      userRef = this.afs.collection(`users`).doc(`${UID}`).collection(`listings`, ref => ref.orderBy('size', 'asc').startAfter(startAfter).limit(6));
    }

    return userRef.valueChanges();
  }

  public async getUserOffers(startAfter?): Promise<Observable<any>> {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    let userRef: AngularFirestoreCollection<any>;

    if (isUndefined(startAfter)) {
      // tslint:disable-next-line: max-line-length
      userRef = this.afs.collection(`users`).doc(`${UID}`).collection(`offers`, ref => ref.orderBy('size', 'asc').limit(6));
    } else {
      // tslint:disable-next-line: max-line-length
      userRef = this.afs.collection(`users`).doc(`${UID}`).collection(`offers`, ref => ref.orderBy('size', 'asc').startAfter(startAfter).limit(6));
    }

    return userRef.valueChanges();
  }

  public async getListing(listingID) {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    const offerRef: AngularFirestoreDocument<any> = this.afs.collection('users').doc(`${UID}`).collection('listings').doc(`${listingID}`);
    return offerRef.get();
  }

  public async updateListing(listingID, productID, oldPrice, condition, price, size): Promise<boolean> {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    const batch = this.afs.firestore.batch();

    const listingRef = this.afs.firestore.collection('users').doc(`${UID}`).collection('listings').doc(`${listingID}`);
    const prodRef = this.afs.firestore.collection('products').doc(`${productID}`).collection('listings').doc(`${listingID}`);

    const productRef = this.afs.firestore.collection(`products`).doc(`${productID}`);

    let prices = [];

    await productRef.collection(`listings`).orderBy(`price`, `asc`).limit(2).get().then(snap => {
        snap.forEach(ele => {
          prices.push(ele.data().price);
        });
    });

    await productRef.get().then(snap => {
        if (isUndefined(prices[1]) || price < snap.data().lowestPrice) {
          batch.update(productRef, {
              lowestPrice: price
          });
        } else if (oldPrice === snap.data().lowestPrice) {
            if (oldPrice < prices[1]) {
              batch.update(productRef, {
                lowestPrice: price
              });
            } else {
              batch.update(productRef, {
                lowestPrice: prices[1]
              });
            }
        }
    });

    batch.update(listingRef, {
      condition: condition,
      price: price,
      size: size
    });

    batch.update(prodRef, {
      condition: condition,
      price: price,
      size: size
    });

    return batch.commit()
      .then(() => {
        console.log('Listing updated');
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }

  public async deleteListing(listingID, productID, price): Promise<boolean> {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    const batch = this.afs.firestore.batch();

    const offerRef = this.afs.firestore.collection('users').doc(`${UID}`).collection('listings').doc(`${listingID}`);
    const listingRef = this.afs.firestore.collection('products').doc(`${productID}`).collection('listings').doc(`${listingID}`);
    const userRef = this.afs.firestore.collection('users').doc(`${UID}`);

    batch.delete(offerRef);
    batch.delete(listingRef);
    batch.update(userRef, {
      listed: firebase.firestore.FieldValue.increment(-1)
    });

    let prices = [];

    await this.afs.firestore.collection('products').doc(`${productID}`).collection(`listings`).orderBy(`price`, `asc`).limit(2).get().then(snap => {
      snap.forEach(data => {
        prices.push(data.data().price);
      });
    });

    // console.log(`length: ${prices.length}; price1: ${prices[0]}; price2: ${prices[1]}`);
    // console.log(prices);

    const prodRef = this.afs.firestore.collection(`products`).doc(`${productID}`);

    if (price >= prices[0] && price < prices[1]) {
      batch.set(prodRef, {
        lowestPrice: prices[1]
      }, { merge: true });
    } else if (prices.length == 1) {
      console.log('working');
      batch.update(prodRef, {
        lowestPrice: firebase.firestore.FieldValue.delete()
      });
    }

    return batch.commit()
      .then(() => {
        console.log('listing deleted');
        return true;
      })
      .catch((err) => {
        console.error(err);
        return false;
      });
  }
}
