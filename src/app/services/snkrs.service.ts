import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class SnkrsService {

  constructor(
    private afs: AngularFirestore
  ) { }

  getLeaderboard() {

  }

  getGameID(timestamp): Promise<string[] | boolean> {
    return this.afs.collection(`snkrs`).ref.where('closingDate', '>', timestamp).orderBy('closingDate', 'asc').limit(1).get().then(res => {
      return this.afs.collection(`snkrs`).doc(`${res.docs[0].data().ID}`).collection('questions').ref.where(`closingDate`, '>', timestamp).orderBy('closingDate', 'asc').limit(1).get().then(response => {
        if (res.docs[0].exists && response.docs[0].exists) {
          return [res.docs[0].data().ID, response.docs[0].data().ID];
        } else {
          return false;
        }
      })
    })
  }

  getQuestions(gameID: string, qID: string) {
    return this.afs.collection(`snkrs`).doc(`${gameID}`).collection(`questions`).doc(`${qID}`).ref.get();
  }

  addUserAnswer(payload, uid: string, gameID: string, qID: string) {
    return this.afs.collection(`snkrs`).doc(`${gameID}`).collection('users').doc(`${uid}`).collection(`questions`).doc(`${qID}`).set({
      answers: firebase.firestore.FieldValue.arrayUnion(payload),
      totalPoints: firebase.firestore.FieldValue.increment(payload.points)
    }, { merge: true }).then(() => {
      return true;
    }).catch((err) => {
      console.error(err);
      return false;
    });
  }

  startGame(UID: string, gameID: string, qID: string): Promise<number | boolean> {
    const userRef = this.afs.collection(`snkrs`).doc(`${gameID}`).collection(`users`).doc(`${UID}`);

    return userRef.collection(`questions`).doc(`${qID}`).ref.get().then(res => {
      if (!res.exists) {
        return userRef.ref.get().then((response): Promise<number | boolean> => {
          if (!response.exists) {
            return this.afs.collection(`users`).doc(`${UID}`).ref.get().then(data => {
              if (data.exists) {
                userRef.set({
                  points: 0,
                  username: data.data().username,
                  uid: UID
                });
              } else {
                // Cannot find the user's information. TO SOLVE
                return Promise.resolve(false);
              }
            }).catch(err => {
              console.error(err);
              return Promise.resolve(false);
            });
          }

          return Promise.resolve(0);
        });
      } else {
        // User is in snkrs collection and has answered questions. return 'user resuming'
        return userRef.collection(`questions`).doc(`${qID}`).ref.get().then(res => {
          return res.data().answers.length as number;
        });
      }
    });
  }

}
