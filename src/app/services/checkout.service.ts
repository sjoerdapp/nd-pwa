import { Injectable } from '@angular/core';
// import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';
import { Transaction } from '../models/transaction';
import { SlackService } from './slack.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    // private cartService: CartService,
    private auth: AuthService,
    private afs: AngularFirestore,
    private slack: SlackService,
    private http: HttpClient
  ) { }

  async transactionApproved(product, paymentID: string, shippingCost: number) {
    let UID;
    await this.auth.isConnected().then(res => {
      UID = res.uid;
    });
    const batch = firebase.firestore().batch();
    const id = product.model.replace(/ /g, '-').toLowerCase();
    const boughtAt = Date.now();
    const transactionID = `${UID}-${product.sellerID}-${boughtAt}`;

    const sellerRef = this.afs.firestore.collection(`users`).doc(`${product.sellerID}`);
    const buyerRef = this.afs.firestore.collection(`users`).doc(`${UID}`);
    const prodRef = this.afs.firestore.collection(`products`).doc(`${id}`);
    const tranRef = this.afs.firestore.collection(`transactions`).doc(`${transactionID}`);

    const transactionData: Transaction = {
      assetURL: product.assetURL,
      condition: product.condition,
      listingID: product.listingID,
      productID: id,
      model: product.model,
      price: product.price,
      sellerID: product.sellerID,
      buyerID: UID,
      size: product.size,
      listedAt: product.timestamp,
      boughtAt,
      status: {
        verified: false,
        shipped: false,
        delivered: false,
        cancelled: false
      },
      paymentID,
      shippingCost,
      type: 'bought'
    };

    let prices = [];

    await this.afs.firestore.collection('products').doc(`${id}`).collection(`listings`).orderBy(`price`, `asc`).limit(2).get().then(snap => {
      snap.forEach(data => {
        prices.push(data.data().price);
      });
    });

    if (product.price >= prices[0] && product.price < prices[1]) {
      batch.set(prodRef, {
        lowestPrice: prices[1]
      }, { merge: true });
    } else if (prices.length == 1) {
      // console.log('working');
      batch.update(prodRef, {
        lowestPrice: firebase.firestore.FieldValue.delete()
      });
    }

    // delete listings
    batch.delete(sellerRef.collection(`listings`).doc(`${product.listingID}`));
    batch.delete(prodRef.collection(`listings`).doc(`${product.listingID}`));

    // set ordered and sol fields
    batch.set(buyerRef, {
      ordered: firebase.firestore.FieldValue.increment(1)
    }, { merge: true });
    batch.set(sellerRef, {
      listed: firebase.firestore.FieldValue.increment(-1),
      sold: firebase.firestore.FieldValue.increment(1)
    }, { merge: true });

    // add transaction doc to  transactions collection
    batch.set(tranRef, transactionData, { merge: true })

    return batch.commit()
      .then(() => {
        //console.log('Transaction Approved');
        const msg = `${UID} bought ${product.model}, size ${product.size} at ${product.price} from ${product.sellerID}`;
        this.slack.sendAlert('sales', msg).catch(err => {
          //console.error(err)
        });
        this.http.post(`${environment.cloud.url}orderConfirmation`, transactionData).subscribe(res => {
          //console.log(res);
        });
        return transactionID;
      })
      .catch(err => {
        //console.error(err);
        return false;
      })
  }

  async sellTransactionApproved(product) {
    let UID;
    await this.auth.isConnected().then(res => {
      UID = res.uid;
    });
    const batch = firebase.firestore().batch();
    const id = product.model.replace(/ /g, '-').toLowerCase();
    const soldAt = Date.now();
    const transactionID = `${product.buyerID}-${UID}-${soldAt}`;

    const buyerRef = this.afs.firestore.collection(`users`).doc(`${product.buyerID}`);
    const sellerRef = this.afs.firestore.collection(`users`).doc(`${UID}`);
    const prodRef = this.afs.firestore.collection(`products`).doc(`${id}`);
    const tranRef = this.afs.firestore.collection(`transactions`).doc(`${transactionID}`);

    const transactionData: Transaction = {
      assetURL: product.assetURL,
      condition: product.condition,
      offerID: product.offerID,
      productID: id,
      model: product.model,
      price: product.price,
      sellerID: UID,
      buyerID: product.buyerID,
      size: product.size,
      listedAt: product.timestamp,
      soldAt,
      status: {
        verified: false,
        shipped: false,
        delivered: false,
        cancelled: false
      },
      paymentID: '',
      shippingCost: 18,
      type: 'sold'
    };

    // delete listings
    batch.delete(sellerRef.collection(`offers`).doc(`${product.offerID}`));
    batch.delete(prodRef.collection(`offers`).doc(`${product.offerID}`));

    // set ordered and sol fields
    batch.set(buyerRef, {
      ordered: firebase.firestore.FieldValue.increment(1),
      offers: firebase.firestore.FieldValue.increment(-1)
    }, { merge: true });
    batch.set(sellerRef, {
      sold: firebase.firestore.FieldValue.increment(1)
    }, { merge: true });

    // add transaction doc to  transactions collection
    batch.set(tranRef, transactionData, { merge: true })

    return batch.commit()
      .then(() => {
        //console.log('Transaction Approved');
        return transactionID;
      })
      .catch(err => {
        //console.error(err);
        return false;
      })
  }

  /*getCartItems() {
    return this.cartService.getCartItems();
  }*/

  getShippingInfo() {
    return this.auth.isConnected().then(res => {
      return this.afs.collection(`users`).doc(`${res.uid}`).ref.get().then(data => {
        return data.data().shippingAddress;
      })
    });
  }

  getFreeShipping() {
    return this.auth.isConnected().then(res => {
      return this.afs.collection(`users`).doc(`${res.uid}`).get();
    });
  }
}
