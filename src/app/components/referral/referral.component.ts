import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { isNullOrUndefined } from 'util';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-referral',
  templateUrl: './referral.component.html',
  styleUrls: ['./referral.component.scss']
})
export class ReferralComponent implements OnInit {

  sent: boolean = false;
  error: boolean = false;
  loading: boolean = false;
  phoneNumber: number;

  constructor(
    private auth: AuthService,
    private http: HttpClient,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
  }


  sendInvite() {
    this.loading = true;
    this.phoneNumber = +(((document.getElementById('phone-number') as HTMLInputElement).value).replace(/\(|\)|\+|\-|\s/g, ""));

    this.auth.isConnected().then(res => {

      if (isNullOrUndefined(res)) {
        this.loading = false;
        this.error = true;
      } else {
        if (!isNaN(this.phoneNumber) && !isNullOrUndefined(this.phoneNumber)) {
          this.afs.collection(`users`).doc(`${res.uid}`).get().subscribe(response => {
            let name;
            (isNullOrUndefined(response.data().lastName)) ? name = response.data().firstName + response.data().lastName : name = response.data().firstName;

            const data = {
              phoneNumber: this.phoneNumber,
              name
            }

            this.http.post(`${environment.cloud.url}inviteFriend`, data).subscribe(message => {
              this.loading = false;

              if (message) {
                this.sent = true;
              } else {
                this.error = true;
              }
            })
          });
        }

        setTimeout(() => {
          this.error = false;
          this.sent = false;
        }, 1500)
      }
    });
  }

}
