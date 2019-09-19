import { Injectable } from '@angular/core';
// import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    // private cartService: CartService,
    private auth: AuthService,
    private afs: AngularFirestore,
  ) { }

  async transactionApproved(product) {
    let UID;
    await this.auth.isConnected().then(res => {
      UID = res.uid;
    });
    const batch = firebase.firestore().batch();
    const id = product.model.replace(/ /g, '-').toLowerCase();
    const boughtAt = Date.now();
    const transactionID = `${UID}-${product.sellerID}-${boughtAt}`;

    const productRef = this.afs.firestore.collection(`products`).doc(`${id}`).collection(`listings`).doc(`${product.listingID}`);
    const userRef = this.afs.firestore.collection(`users`).doc(`${product.sellerID}`).collection(`listings`).doc(`${product.listingID}`);
    const userTranRef = this.afs.firestore.collection(`users`).doc(`${product.sellerID}`).collection(`orders`).doc(`${product.listingID}`);
    const tranRef = this.afs.firestore.collection(`transactions`).doc(`${transactionID}`);

    const transactionData = {
      assetURL: product.assetURL,
      condition: product.condition,
      listingID: product.listingID,
      model: product.model,
      price: product.price,
      sellerID: product.sellerID,
      buyerID: UID,
      size: product.size,
      listedAt: product.timestamp,
      boughtAt,
      status: {
        sold: true,
        inRoute: false,
        verified: false,
        shipped: false,
        delivered: false
      }
    }

    batch.delete(productRef);
    batch.delete(userRef);
    batch.set(userTranRef, transactionData);
    batch.set(tranRef, transactionData);

    batch.commit()
    .then(() => {
      console.log('Transaction Approved');
      return true;
    })
    .catch(err => {
      console.error(err);
      return false;
    })
  }

  /*getCartItems() {
    return this.cartService.getCartItems();
  }

  getShippingInfo() {
    return this.auth.isConnected().then(res => {
      return this.afs.collection(`users`).doc(`${res.uid}`).ref.get().then(data => {
        return data.data().shippingAddress;
      })
    });
  }*/
}
