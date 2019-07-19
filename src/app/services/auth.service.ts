import {
  Injectable,
  NgZone
} from '@angular/core';
import { Router } from '@angular/router';

import { auth } from 'firebase/app';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument
} from '@angular/fire/firestore';

import { Observable, of } from 'rxjs';
import { User } from '../models/user';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user: Observable<User>;
  usernameAvailable: any = { usernameAvailable: false };

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

  async signOut() {
    await this.afAuth.auth.signOut()
    .then(() => {
      console.log('Signed Out');
      return this.ngZone.run(() => {
        return this.router.navigate(['/bye']);
      });
    })
    .catch((error) => {
      console.error('Sign out error', error);
    });
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    return this.oAuthLogin(provider);
  }

  async facebookSignIn() {
    const provider = new auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  async emailSignUp(email: string, password: string, firstName: string, lastName: string, username: string) {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        const userData: User = {
          firstName,
          lastName,
          username,
          email: user.user.email,
          uid: user.user.uid
        };

        return this.createUserData(userData);
      });
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        this.updateUserData(credential.user);
      })
      .catch(error => {
        console.error('Error: ', error);
      });
  }

  private createUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc('users/${user.uid}');

    return userRef.set(user, { merge: true })
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

  checkUsername(username) {
    return this.afs.collection('users', ref => ref.where('username', '==', username)).valueChanges();
  }

  checkEmail(email) {
    return this.afs.collection('users', ref => ref.where('email', '==', email)).valueChanges();
  }
}
