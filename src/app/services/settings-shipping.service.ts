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

  getShippingInfo(userId: string) {
    const userRef = this.afs.collection(`users`).doc(`${userId}`);
    return userRef.valueChanges();
  }

  updateShippingInfo(userId: string, firstName: string, lastName: string, street: string, line: string, city: string, province: string, postalCode: string, country: string): Promise<boolean> {
    const uid = userId;
    const userRef = this.afs.collection(`users`).doc(`${uid}`);

    postalCode = postalCode.toUpperCase();

    return userRef.set({
      shippingAddress: {
        selling: {
          firstName,
          lastName,
          street,
          line2: line,
          city,
          province,
          postalCode,
          country
        }
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
