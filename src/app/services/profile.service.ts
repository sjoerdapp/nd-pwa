import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { User } from '../models/user';
import { Observable } from 'rxjs';

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
}
