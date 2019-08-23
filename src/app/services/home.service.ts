import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Product } from '../models/product';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomeService {

  constructor(
    private afs: AngularFirestore
  ) { }

  public getNewReleases() {
    // tslint:disable-next-line: max-line-length
    const newReleasesRef: AngularFirestoreCollection<Product> = this.afs.collection('products', ref => ref.orderBy('yearMade', 'desc').limit(10));
    return newReleasesRef.valueChanges();
  }

  public getDiscovery() {
    // tslint:disable-next-line: max-line-length
    const discovery: AngularFirestoreCollection<Product> = this.afs.collection('products', ref => ref.orderBy('discoveryRank', 'asc').limit(4));
    return discovery.valueChanges();
  }

  public getTrending() {
    // tslint:disable-next-line: max-line-length
    const trending: AngularFirestoreCollection<Product> = this.afs.collection('products', ref => ref.orderBy('trendingRank', 'asc').limit(10));
    return trending.valueChanges();
  }

}
