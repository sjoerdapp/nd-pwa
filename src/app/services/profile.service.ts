import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { isUndefined, isNullOrUndefined } from 'util';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Ask } from '../models/ask';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private http: HttpClient
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
      userRef = this.afs.collection(`users`).doc(`${UID}`).collection(`listings`, ref => ref.orderBy('timestamp', 'desc').limit(60));
    } else {
      // tslint:disable-next-line: max-line-length
      userRef = this.afs.collection(`users`).doc(`${UID}`).collection(`listings`, ref => ref.orderBy('timestamp', 'desc').startAfter(startAfter).limit(60));
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
      userRef = this.afs.collection(`users`).doc(`${UID}`).collection(`offers`, ref => ref.orderBy('timestamp', 'desc').limit(60));
    } else {
      // tslint:disable-next-line: max-line-length
      userRef = this.afs.collection(`users`).doc(`${UID}`).collection(`offers`, ref => ref.orderBy('timestamp', 'desc').startAfter(startAfter).limit(60));
    }

    return userRef.valueChanges();
  }

  public async getListing(listing_id) {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    return this.afs.collection('users').doc(`${UID}`).collection('listings').doc(`${listing_id}`).valueChanges();
  }

  public async updateListing(listing_id: string, product_id: string, old_price: number, condition: string, price: number, size: string): Promise<boolean> {
    let UID: string;
    await this.auth.isConnected().then(data => {
      UID = data.uid;
    });

    const batch = this.afs.firestore.batch();
    const last_updated = Date.now()
    
    const userAskRef = this.afs.firestore.collection('users').doc(`${UID}`).collection('listings').doc(`${listing_id}`); //ask in user doc ref
    const prodAskRef = this.afs.firestore.collection('products').doc(`${product_id}`).collection('listings').doc(`${listing_id}`); //ask in prod doc ref
    const askRef = this.afs.firestore.collection(`asks`).doc(`${listing_id}`); //ask in asks collection ref

    const prodRef = this.afs.firestore.collection(`products`).doc(`${product_id}`); //prod ref in prod document
    let prices: Ask[] = []; //lowest prices
    let size_prices: Ask[] = []; //size lowest prices

    //get the two lowest prices
    await prodRef.collection(`listings`).orderBy(`price`, `asc`).limit(2).get().then(snap => {
      snap.forEach(ele => {
        prices.push(ele.data() as Ask);
      });
    });

    //get the two lowest prices in specific size
    await prodRef.collection(`listings`).where('size', '==', `${size}`).where('condition', '==', `${condition}`).orderBy(`price`, `asc`).limit(2).get().then(snap => {
      snap.forEach(ele => {
        size_prices.push(ele.data() as Ask);
      });
    });

    //get prod info and compare current ask price w lowest ask. update if necessary.
    await prodRef.get().then(snap => {
      if (isUndefined(prices[1]) || price < snap.data().lowestPrice) {
        batch.update(prodRef, {
          lowestPrice: price
        })
      } else if (old_price === snap.data().lowestPrice) {
        //console.log(`${prices[0]} and ${prices[1]}`)
        if (price < prices[1].price) {
          batch.update(prodRef, {
            lowestPrice: price
          })
        } else {
          batch.update(prodRef, {
            lowestPrice: prices[1].price
          })
        }
      }
    });

    // update ask in asks collection
    batch.update(askRef, {
      condition: condition,
      price: price,
      size: size,
      last_updated
    });

    // update ask in user doc
    batch.update(userAskRef, {
      condition: condition,
      price: price,
      size: size,
      last_updated
    });

    // update ask in prod doc
    batch.update(prodAskRef, {
      condition: condition,
      price: price,
      size: size,
      last_updated
    });

    // commit the updates
    return batch.commit()
      .then(() => {
        //console.log('Listing updated');
        this.sendLowestAskNotification(price, condition, size, UID, product_id, listing_id, size_prices) //send new lowest ask notification if necessary
        return true;
      })
      .catch((err) => {
        //console.error(err);
        return false;
      });
  }

  public async deleteListing(ask: Ask): Promise<boolean> {
    const batch = this.afs.firestore.batch();
    
    const userAskRef = this.afs.firestore.collection('users').doc(`${ask.sellerID}`).collection('listings').doc(`${ask.listingID}`); //ask in user doc ref
    const prodAskRef = this.afs.firestore.collection('products').doc(`${ask.productID}`).collection('listings').doc(`${ask.listingID}`); //ask in prod doc ref
    const userRef = this.afs.firestore.collection('users').doc(`${ask.sellerID}`); //user doc ref
    const askRef = this.afs.firestore.collection(`asks`).doc(`${ask.listingID}`); //ask in asks collection ref

    batch.delete(userAskRef); //remove ask in user doc
    batch.delete(prodAskRef); //remove ask in prod doc
    batch.delete(askRef); //remove ask in asks collection

    //udpate ask number in user doc
    batch.update(userRef, {
      listed: firebase.firestore.FieldValue.increment(-1)
    });

    const prodRef = this.afs.firestore.collection(`products`).doc(`${ask.productID}`); //prod ref in prod document
    let prices: Ask[] = [] //lowest prices
    let size_prices: Ask[] = [] //size lowest prices

    //get two lowest prices
    await prodRef.collection(`listings`).orderBy(`price`, `asc`).limit(2).get().then(snap => {
      snap.forEach(data => {
        prices.push(data.data().price as Ask);
      });
    });

    //get two lowest prices in specific size
    await prodRef.collection(`listings`).where('size', '==', `${ask.size}`).where('condition', '==', `${ask.condition}`).orderBy(`price`, `asc`).limit(2).get().then(snap => {
      snap.forEach(ele => {
        size_prices.push(ele.data() as Ask);
      });
    });

    // console.log(`length: ${prices.length}; price1: ${prices[0]}; price2: ${prices[1]}`);
    // console.log(prices);

    //udpate new lowest price
    if (prices.length === 1) {
      batch.update(prodRef, {
        lowestPrice: firebase.firestore.FieldValue.delete()
      });
    } else if (ask.price === prices[0].price && prices[0].price != prices[1].price) {
      batch.update(prodRef, {
        lowestPrice: prices[1].price
      });
    }

    //commit the updates
    return batch.commit()
      .then(() => {
        //console.log('listing deleted');

        if (ask.listingID === size_prices[0].listingID && !isNullOrUndefined(size_prices[0])) {
          this.http.put(`${environment.cloud.url}lowestAskNotification`, {
            product_id: size_prices[1].productID,
            seller_id: size_prices[1].sellerID,
            condition: size_prices[1].condition,
            size: size_prices[1].size,
            listing_id: size_prices[1].listingID,
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

  private sendLowestAskNotification(price: number, condition: string, size: string, UID: string, product_id: string, listing_id: string, size_prices: Ask[]) {
    if (price < size_prices[0].price) {
      this.http.put(`${environment.cloud.url}lowestAskNotification`, {
        product_id: product_id,
        seller_id: UID,
        condition,
        size,
        listing_id: listing_id,
        price
      }).subscribe()
    } else if (!isNullOrUndefined(size_prices[1]) && listing_id === size_prices[0].listingID && price > size_prices[0].price) {
      if (price >= size_prices[1].price) {
        this.http.put(`${environment.cloud.url}lowestAskNotification`, {
          product_id: product_id,
          seller_id: size_prices[1].sellerID,
          condition,
          size,
          listing_id: size_prices[1].listingID,
          price: size_prices[1].price
        }).subscribe()
      } else if (price < size_prices[1].price) {
        this.http.put(`${environment.cloud.url}lowestAskNotification`, {
          product_id: product_id,
          seller_id: UID,
          condition,
          size,
          listing_id: listing_id,
          price
        }).subscribe()
      }
    } else if (isNullOrUndefined(size_prices[1])) {
      this.http.put(`${environment.cloud.url}lowestAskNotification`, {
        product_id: product_id,
        seller_id: UID,
        condition,
        size,
        listing_id: listing_id,
        price
      }).subscribe()
    }
  }
}
