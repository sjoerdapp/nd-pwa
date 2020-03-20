import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class SettingsProfileService {

  constructor(
    private afs: AngularFirestore,
    private auth: AuthService
  ) { }

  getUserInfo(): Promise<Observable<User>> {
    return this.auth.isConnected().then(res => {
      const UID = res.uid;
      return this.afs.collection(`users`).doc(`${UID}`).valueChanges() as Observable<User>;
    });
  }

  async updateUserProfile(firstName: string, lastName: string, username: string, dob: string) {
    return await this.auth.isConnected().then(res => {
      const UID = res.uid;
      const batch = this.afs.firestore.batch();

      const userRef = this.afs.firestore.collection(`users`).doc(`${UID}`);
      const userVerificationRef = this.afs.firestore.collection('userVerification').doc(`${UID}`);

      const date = new Date(dob).getTime() / 1000;
      // console.log(date);

      batch.update(userRef, {
        'firstName': firstName,
        'lastName': lastName,
        'username': username,
        'dob': date
      });

      batch.update(userVerificationRef, {
        username
      })

      return batch.commit()
        .then(() => {
          return true;
        }).catch((err) => {
          console.error(err);
          return false;
        });
    })
  }
}
