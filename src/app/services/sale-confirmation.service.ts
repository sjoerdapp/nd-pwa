import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class SaleConfirmationService {

  constructor(
    private afs: AngularFirestore,
    private http: HttpClient
  ) { }

  transactionData(transactionId: string) {
    return this.afs.collection(`transactions`).doc(`${transactionId}`).valueChanges();
  }

  confirmOrder(transactionId: string) {
    return this.afs.collection(`transactions`).doc(`${transactionId}`).set({
      status: {
        sellerConfirmation: true
      }
    }, { merge: true }).then(() => {
      return true;
    }).catch(() => {
      return false;
    })
  }

  cancelOrder(transactionId: string, transactionData: Transaction, isSeller: boolean) {
    if (isSeller) {
      return this.afs.collection(`transactions`).doc(`${transactionId}`).set({
        cancellationNote: 'Seller cancelled the order.',
        status: {
          cancelled: true
        }
      }, { merge: true }).then(() => {
        transactionData.status.cancelled = true;
        transactionData.cancellationNote = 'Seller cancelled the order.';
        this.http.post(`${environment.cloud.url}orderCancellation`, transactionData).subscribe();
        return true;
      }).catch(() => {
        return false;
      })
    }
  }
}
