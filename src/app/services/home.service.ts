import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { isUndefined } from 'util';

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


    let t = new Date();
    const dd = String(t.getDate()).padStart(2, '0');
    const mm = String(t.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = t.getFullYear();
    const today = `${yyyy}-${mm}-${dd}`;
    // console.log(today);

    const newReleaseRef = this.afs.collection(`products`, ref => ref.where(`yearMade`, `<=`, `${today}`).orderBy(`yearMade`, `desc`).limit(50));
    return newReleaseRef.get();
  }

  public getDiscovery(after?) {
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

    if (isUndefined(after)) {
      after = 0;
    }

    const discoveryRef = this.afs.collection(`products`, ref => ref.orderBy(`discoveryRank`, `asc`).startAfter(after).limit(12));
    return discoveryRef.get();
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

    const trendingRef = this.afs.collection(`products`, ref => ref.orderBy(`trendingRank`, `asc`).limit(50));
    return trendingRef.get();
  }

}
