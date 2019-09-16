import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private cartService: CartService,
    private auth: AuthService,
    private afs: AngularFirestore
  ) { }

  getCartItems() {
    return this.cartService.getCartItems();
  }

  getShippingInfo() {
    return this.auth.isConnected().then(res => {
      return this.afs.collection(`users`).doc(`${res.uid}`).ref.get().then(data => {
        return data.data().shippingAddress;
      })
    });
  }
}
