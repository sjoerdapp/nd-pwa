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

    /*this.afs.collection(`transactions`).doc(`W23SBTGQN1XUsFF16V72WXtS4Gw2-zNSB9cdIPTZykSJv7xCoTeueFmk2-1569537745671`).get().subscribe(res => {
      this.http.post(`${environment.cloud.url}productShipment`, res.data()).subscribe((re: any) => {
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
