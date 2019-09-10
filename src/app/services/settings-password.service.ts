import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class SettingsPasswordService {

  constructor(
    private afAuth: AngularFireAuth
  ) { }

  async updatePassword(oldPassword: string, newPassword: string) {
    const user = this.afAuth.auth.currentUser;
    const credentials = auth.EmailAuthProvider.credential(this.afAuth.auth.currentUser.email, oldPassword);
    return user.reauthenticateWithCredential(credentials).then(() => {
      return user.updatePassword(newPassword).then(() => {
        return true;
      }).catch((err) => {
        console.error(err);
        return false;
      });
    }).catch((err) => {
      console.error(err);
      return false;
    });
  }
}
