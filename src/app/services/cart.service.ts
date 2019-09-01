import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  UID: string;

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore
  ) { }

  async getCartItems() {
    await this.auth.isConnected().then(data => {
      this.UID = data.uid;
    });

    return this.afs.collection(`users`).doc(`${this.UID}`).collection(`cart`).valueChanges();
  }

  async removeFromCart(ID: string) {
    const batch = this.afs.firestore.batch();

    const cartRef = this.afs.firestore.collection(`users`).doc(`${this.UID}`).collection(`cart`).doc(`${ID}`);
    const prodRef = this.afs.firestore.collection(`users`).doc(`${this.UID}`);

    batch.delete(cartRef);
    batch.set(prodRef, {
      cartItems: firebase.firestore.FieldValue.increment(-1)
    }, { merge: true });

    batch.commit().then(() => {
        console.log(`Item removed from cart`);
      })  
      .catch(err => {
        console.error(err);
      });
  }

}
