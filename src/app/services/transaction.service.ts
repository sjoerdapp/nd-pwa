import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';
import { AuthService } from './auth.service';
import * as firebase from 'firebase/app';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService,
    private http: HttpClient
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

  confirmOrder(transactionID: string) {
    return this.afs.collection(`transactions`).doc(`${transactionID}`).update({
      'status.sellerConfirmation': true
    }).then(() => {
      return true;
    }).catch(() => {
      return false;
    })
  }

  cancelOrder(transactionID: string, transactionData: Transaction, isSeller: boolean) {
    let cancellationNote;

    if (isSeller) {
      cancellationNote = 'Seller cancelled the order';
    } else {
      cancellationNote = 'Buyer cancelled the order';
    }

    return this.afs.collection(`transactions`).doc(`${transactionID}`).set({
      status: {
        cancelled: true
      },
      cancellationNote
    }, { merge: true }).then(() => {
      transactionData.cancellationNote = cancellationNote;
      transactionData.status.cancelled = true;
      this.http.post(`${environment.cloud.url}orderCancellation`, transactionData).subscribe();
      return true;
    }).catch(() => {
      return false;
    })
  }
}
