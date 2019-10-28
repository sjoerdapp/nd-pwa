import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import * as firebase from 'firebase/app';
import { SlackService } from 'src/app/services/slack.service';

@Injectable({
  providedIn: 'root'
})
export class SpecialDropService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private slack: SlackService
  ) { }

  submitBid(price: number, dropID: string, exist: boolean) {
    return this.auth.isConnected().then(res => {
      const uid = res.uid;
      const time = Date.now();
      const batch = firebase.firestore().batch()

      const addBid = this.afs.firestore.collection('specialDrops').doc(`${dropID}`).collection(`bids`).doc(`${uid}`);
      const addCounter = this.afs.firestore.collection(`specialDrops`).doc(`${dropID}`);

      batch.set(addBid, {
        uid,
        price,
        time
      }, { merge: true });

      if (!exist) {
        batch.update(addCounter, {
          numBid: firebase.firestore.FieldValue.increment(1)
        });
      }

      return batch.commit().then(() => {
        this.slack.sendAlert('others', `Election Day Drop: ${uid} bid CA$${price} for ${dropID}`);
        return true;
      }).catch((err) => {
        console.error(err);
        return false;
      })
    }).catch((err) => {
      console.error(err);
      return false;
    });
  }

  getHighestBid(dropID: string) {
    return this.afs.collection(`specialDrops`).doc(`${dropID}`).collection(`bids`).ref.orderBy(`price`, 'desc').limit(1).get();
  }

  getNumBid(dropID: string) {
    return this.afs.collection(`specialDrops`).doc(`${dropID}`).valueChanges();
  }

  getNumUserBid(dropID: string) {
    return this.auth.isConnected().then(res => {
      const uid = res.uid;

      return this.afs.collection(`specialDrops`).doc(`${dropID}`).collection(`bids`).ref.where('uid', '==', `${uid}`).get();
    })
  }
}
