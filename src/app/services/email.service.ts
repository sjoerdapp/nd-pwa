import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';
import * as firebase from 'firebase/app';


@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private afs: AngularFirestore,
    private afAuth: AngularFireAuth,
    private http: HttpClient
  ) { }

  passwordChange() {
    const user = this.afAuth.auth.currentUser;
    const endpoint = 'https://us-central1-nxtdrop-app.cloudfunctions.net/changedPassword';

    this.afs.collection(`users`).doc(`${user.uid}`).get().subscribe(res => {
      const email = res.data().email;

      const data = {
        toEmail: email,
        toName: res.data().username
      };

      this.http.post(endpoint, data).subscribe();
    })
  }

  sendResetLink(email: string) {
    return this.afs.collection(`users`).ref.where(`email`, `==`, `${email}`).limit(1).get().then(res => {
      if (!res.empty) {
        return firebase.auth().sendPasswordResetEmail(email).then(() => {
          return true;
        }).catch((err) => {
          console.error(err);
          return false;
        });
      }

      return false;
    });
  }

  resetPassword(code: string, newPass: string) {
    return firebase.auth().confirmPasswordReset(code, newPass).then(() => {
      return true;
    })
    .catch((err) => {
      console.error(err);
      return false;
    });
  }

  activateAccount() {
    const user = this.afAuth.auth.currentUser;
    const endpoint = 'https://us-central1-nxtdrop-app.cloudfunctions.net/accountCreated';

    this.afs.collection(`users`).doc(`${user.uid}`).get().subscribe(res => {
      const email = res.data().email;

      const data = {
        toEmail: email,
        toName: res.data().firstName + ' ' + res.data().lastName,
        toUid: res.data().uid
      };

      this.http.post(endpoint, data).subscribe();
    })
  }
}
