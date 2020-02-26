import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private afs: AngularFirestore
  ) { }

  userData(uid: string) {
    return this.afs.collection(`users`).doc(`${uid}`).valueChanges();
  }

  purchases(uid: string) {
    return this.afs.collection(`transactions`, ref => ref.where(`buyerID`, `==`, `${uid}`)).valueChanges();
  }

  sales (uid: string) {
    return this.afs.collection(`transactions`, ref => ref.where(`sellerID`, `==`, `${uid}`)).valueChanges();
  }
}
