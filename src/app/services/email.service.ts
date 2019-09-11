import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireAuth } from '@angular/fire/auth';
import { HttpClient } from '@angular/common/http';


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

      this.http.post(endpoint, data).subscribe(
        data => console.log('success', data),
        error => console.log('oops', error)
      );
    })
  }
}
