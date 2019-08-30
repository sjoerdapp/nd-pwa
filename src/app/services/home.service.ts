import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from '../models/product';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private afs: AngularFirestore
  ) { }

  public getNewReleases() {
    let newReleaseData = [];

    this.afs.firestore.collection('products').orderBy('yearMade', 'desc').limit(10).get().then(snap => {
      snap.forEach(doc => {
        this.afs.firestore.collection('products').doc(doc.data().productID).collection('listings').orderBy('price', 'asc').limit(1).get().then(data => {
          const dt = doc.data();
          data.forEach(val => dt.lowestPrice = val.data().price);
          newReleaseData.push(dt);
        });
      });
    });

    return of(newReleaseData);
  }

  public getDiscovery() {
    let discoveryData = [];

    this.afs.firestore.collection('products').orderBy('discoveryRank', 'asc').limit(10).get().then(snap => {
      snap.forEach(doc => {
        this.afs.firestore.collection('products').doc(doc.data().productID).collection('listings').orderBy('price', 'asc').limit(1).get().then(data => {
          const dt = doc.data();
          data.forEach(val => dt.lowestPrice = val.data().price);
          discoveryData.push(dt);
        });
      });
    });

    return of(discoveryData);
  }

  public getTrending() {
    let trendingData = [];

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
    
    return of(trendingData);
  }

}
