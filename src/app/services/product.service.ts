import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    private auth: AuthService,
    private afs: AngularFirestore
  ) { }

  getProductInfo(productID) {
    return this.afs.collection('products').doc(`${productID}`).valueChanges();
  }

  getOffers(productID) {
    return this.afs.collection('products').doc(`${productID}`).collection('listings').valueChanges();
  }
}
