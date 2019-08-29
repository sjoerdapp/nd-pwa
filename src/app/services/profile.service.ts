import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';

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

  public async getUserListings(): Promise<Observable<any>> {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    // tslint:disable-next-line: max-line-length
    const userRef: AngularFirestoreCollection<any> = this.afs.collection(`users`).doc(`${UID}`).collection(`listings`, ref => ref.orderBy('timestamp', 'desc'));
    return userRef.valueChanges();
  }

  public async getOffer(listingID) {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    const offerRef: AngularFirestoreDocument<any> = this.afs.collection('users').doc(`${UID}`).collection('listings').doc(`${listingID}`);
    return offerRef.valueChanges();
  }

  public async updateOffer(listingID, productID, condition, price, size): Promise<boolean> {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    const batch = this.afs.firestore.batch();

    const offerRef = this.afs.firestore.collection('users').doc(`${UID}`).collection('listings').doc(`${listingID}`);
    const prodRef = this.afs.firestore.collection('products').doc(`${productID}`).collection('listings').doc(`${listingID}`);

    batch.update(offerRef, {
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

  public async deleteOffer(listingID, productID): Promise<boolean> {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    const batch = this.afs.firestore.batch();

    const offerRef = this.afs.firestore.collection('users').doc(`${UID}`).collection('listings').doc(`${listingID}`);
    const prodRef = this.afs.firestore.collection('products').doc(`${productID}`).collection('listings').doc(`${listingID}`);
    const userRef = this.afs.firestore.collection('users').doc(`${UID}`);

    batch.delete(offerRef);
    batch.delete(prodRef);
    batch.update(userRef, {
      listed: firebase.firestore.FieldValue.increment(-1)
    });

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
