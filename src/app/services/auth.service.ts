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

import { User } from '../models/user';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user;
  userStatus: boolean;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private router: Router,
    private ngZone: NgZone
  ) { }

  async signOut(redirect: boolean) {
    await this.afAuth.auth.signOut()
      .then(() => {
        console.log('Signed Out');
        if (redirect) {
          return this.ngZone.run(() => {
            return this.router.navigate(['/bye']);
          });
        }
      })
      .catch((error) => {
        console.error('Sign out error', error);
      });
  }

  async googleSignIn() {
    const provider = new auth.GoogleAuthProvider();
    this.oAuthLogin(provider);
  }

  async facebookSignIn() {
    const provider = new auth.FacebookAuthProvider();
    return this.oAuthLogin(provider);
  }

  async emailSignUp(email: string, password: string, firstName: string, lastName: string, username: string) {
    if (email || password || firstName || lastName || username) {
      return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
      .then(user => {
        const userData: User = {
          firstName,
          lastName,
          username,
          email: user.user.email,
          uid: user.user.uid,
          listed: 0,
          sold: 0,
          ordered: 0,
          counterOffer: 0
        };

        return this.createUserData(userData);
      });
    } else {
      return false;
    }
  }

  async emailLogin(email: string, password: string) {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        return this.ngZone.run(() => {
          return this.router.navigate(['/home']);
        });
      })
      .catch(error => {
        console.error('Error Login: Email or Password Invalid.');
        return false;
      });
  }

  private oAuthLogin(provider) {
    return this.afAuth.auth.signInWithPopup(provider)
      .then((credential) => {
        if (this.handleAuthToken(credential.user)) {
          console.log('does exist');
          // console.log(this.handleAuthToken(credential.user));
        } else {
          console.log('does not exist');
        }
      })
      .catch(error => {
        console.error('Error: ', error);
      });
  }

  private handleAuthToken(user) {
    return this.checkEmail(user.email).get().subscribe((snapshot) => {
      if (snapshot.empty) {
        return this.ngZone.run(() => {
          return this.router.navigate(['/additional-information']);
        });
      } else {
        return this.ngZone.run(() => {
          return this.router.navigate(['/home']);
        });
      }
    });
  }

  private createUserData(user: User) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

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

  public isConnected(): Promise<firebase.User> {
    return this.afAuth.authState.pipe(first()).toPromise();
  }

  public async checkStatus() {
    const user = await this.isConnected();

    if (user) {
      return true;
    } else {
      return false;
    }
  }

  public addInformationUser(firstName: string, lastName: string, username: string, password: string) {
    const credential = auth.EmailAuthProvider.credential(this.afAuth.auth.currentUser.email, password);

    return this.afAuth.auth.currentUser.linkWithCredential(credential)
      .then((userCredential) => {
        const userData: User = {
          firstName,
          lastName,
          username,
          email: userCredential.user.email,
          uid: userCredential.user.uid,
          listed: 0,
          sold: 0,
          ordered: 0,
          counterOffer: 0
        };

        this.createUserData(userData);
        console.log('Account linked');
      })
      .catch((error) => {
        console.error('Account linking error', error);
      });
  }

  checkUsername(username) {
    console.log('checkUsername() called');
    return this.afs.collection('users', ref => ref.where('username', '==', username));
  }

  checkEmail(email) {
    console.log('checkEmail() called');
    return this.afs.collection('users', ref => ref.where('email', '==', email));
  }
}