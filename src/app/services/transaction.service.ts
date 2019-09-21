import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getTransaction(transactionID: string): Observable<Transaction> {
    return this.afs.collection(`transactions`).doc(`${transactionID}`).valueChanges() as Observable<Transaction>;
  }
}
