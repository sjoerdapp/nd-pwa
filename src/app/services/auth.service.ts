import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { switchMap, merge } from 'rxjs/operators';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private ngZone: NgZone
  ) {
    this.user = this.afAuth.authState.pipe(
      switchMap(user => {
        if (user) {
          return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
        } else {
          return of(null);
        }
      })
    );
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
      });
  }

  async signOut() {
    await this.afAuth.auth.signOut()
    .then(() => {
      console.log('Signed Out');
      return this.ngZone.run(() => {
        return this.router.navigate(['..']);
      });
    })
    .catch((error) => {
      console.error('Sign out error', error);
    });
  }

  private updateUserData(user) {
    // set user data to firestore on login
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data: User = {
      uid: user.uid,
      email: user.email
    };

    return userRef.set(data, { merge: true })
      .then(() => {
        console.log('User information updated');
        return this.ngZone.run(() => {
          return this.router.navigate(['/home']);
        });
      })
      .catch((error) => {
        console.error('Error: ', error);
      });
  }

  public isConnected(): boolean {
    const userStatus = this.afAuth.auth.currentUser;

    if (userStatus) {
      return true;
    } else {
      return false;
    }
  }
}
