import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) { }

  getTransaction(transactionID: string): Observable<Transaction> {
    return this.afs.collection(`transactions`).doc(`${transactionID}`).valueChanges() as Observable<Transaction>;
  }

  removeFreeShipping() {
    this.auth.isConnected().then(res => {
      this.afs.collection(`users`).doc(`${res.uid}`).set({
        freeShipping: firebase.firestore.FieldValue.delete()
      }, { merge: true }).catch(err => {
        console.error(err);
      })
    });
  }
}
