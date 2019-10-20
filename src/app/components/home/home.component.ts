import { Component, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalService } from 'src/app/services/modal.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { isUndefined } from 'util';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  constructor(
    private title: Title,
    private modalService: ModalService,
    private ref: ChangeDetectorRef,
    private afs: AngularFirestore,
    private auth: AuthService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.title.setTitle(`NXTDROP: Buy and Sell Sneakers in Canada`);

    /*this.afs.collection(`transactions`).doc(`DoDgKivIx9OCbrwE2cQAPeWsX8g2-xdDDF5DUuxYA0e49E6VPoYjbNOM2-1571366451521`).get().subscribe(res => {
      this.http.post(`${environment.cloud.url}orderConfirmation`, res.data()).subscribe((re: any) => {
        if (re != 'sent') {
          console.error(`Error: ${re}`);
        } else {
          console.log(`sent`);
        }
      });
    });*/
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.auth.isConnected().then(res => {
        this.afs.collection(`users`).doc(`${res.uid}`).get().subscribe(data => {
          if (isUndefined(data.data().shippingPromo)) {
            // console.log(`freeShipping`);
            //this.modalService.openModal('freeShipping');
          }
        })
      }).catch(err => {
        console.log(`not connected`);
      });
    }, 10000);
    this.ref.detectChanges();
  }

}
