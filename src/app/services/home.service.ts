import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from '../models/product';
import { of } from 'rxjs';
import { retry } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private afs: AngularFirestore
  ) { }

  public getNewReleases() {
    /*let newReleaseData = [];

    this.afs.firestore.collection('products').orderBy('yearMade', 'desc').limit(10).get().then(snap => {
      snap.forEach(doc => {
        this.afs.firestore.collection('products').doc(doc.data().productID).collection('listings').orderBy('price', 'asc').limit(1).get().then(data => {
          const dt = doc.data();
          data.forEach(val => dt.lowestPrice = val.data().price);
          newReleaseData.push(dt);
        });
      });
    });

    return of(newReleaseData);*/

    const newReleaseRef = this.afs.collection(`products`, ref => ref.orderBy(`yearMade`, `asc`).limit(10));
    return newReleaseRef.valueChanges();
  }

  public getDiscovery() {
    /*let discoveryData = [];

    this.afs.firestore.collection('products').orderBy('discoveryRank', 'asc').limit(10).get().then(snap => {
      snap.forEach(doc => {
        this.afs.firestore.collection('products').doc(doc.data().productID).collection('listings').orderBy('price', 'asc').limit(1).get().then(data => {
          const dt = doc.data();
          data.forEach(val => dt.lowestPrice = val.data().price);
          discoveryData.push(dt);
        });
      });
    });

    return of(discoveryData);*/

    const discoveryRef = this.afs.collection(`products`, ref => ref.orderBy(`discoveryRank`, `asc`).limit(10));
    return discoveryRef.valueChanges();
  }

  public getTrending() {
    /*let trendingData = [];

    // tslint:disable-next-line: max-line-length
    this.afs.firestore.collection('products').orderBy('trendingRank', 'asc').limit(10).get().then(snap => {
      snap.forEach(doc => {
        this.afs.firestore.collection('products').doc(doc.data().productID).collection('listings').orderBy('price', 'asc').limit(1).get().then(data => {
          const dt = doc.data();
          data.forEach(val => dt.lowestPrice = val.data().price);
          trendingData.push(dt);
        });
      });
    });
    
    return of(trendingData);*/

    const trendingRef = this.afs.collection(`products`, ref => ref.orderBy(`trendingRank`, `asc`).limit(10));
    return trendingRef.valueChanges();
  }

}
