import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class SettingsShippingService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) { }

  async getShippingInfo() {
    return await this.auth.isConnected().then(res => {
      const uid = res.uid;

      const userRef = this.afs.collection(`users`).doc(`${uid}`);
      return userRef.valueChanges();
    });
  }

  updateShippingInfo(userId: string, street: string, line: string, city: string, province: string, postalCode: string): Promise<boolean> {
    const uid = userId;
    const userRef = this.afs.collection(`users`).doc(`${uid}`);

    postalCode = postalCode.toUpperCase();

    return userRef.set({
    shippingAddress: {
      street,
      line,
      city,
      province,
      postalCode
    }
    }, { merge: true })
    .then(() => {
      return true;
    })
    .catch(() => {
      return false;
    });
  }

}
