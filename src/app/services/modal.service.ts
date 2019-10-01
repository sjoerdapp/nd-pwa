import { Injectable, Output, EventEmitter } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  @Output() product: EventEmitter<Object> = new EventEmitter();
  @Output() open: EventEmitter<string> = new EventEmitter();

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    private afs: AngularFirestore
  ) {
  }

  placeOffer(info) {
    this.product.emit(info);
  }

  openModal(modal: string) {
    this.open.emit(modal);
  }

  closeModal() {
    this.open.emit();
  }

  sendInviteEmail(email: string) {
    const endpoint = `${environment.cloud.url}inviteEmail`;

    return this.auth.isConnected().then(res => {
      return this.afs.collection(`users`).doc(`${res.uid}`).set({
        shippingPromo: {
          sent: true,
          accepted: false
        }
      }, { merge: true }).then(() => {
        // console.log(response);

        const data = {
          from: res.email,
          to: email,
          uid: res.uid
        };

        return this.http.post(endpoint, data);
      }).catch(err => {
        console.error(err);
        return of(false);
      });
    })
  }
}
