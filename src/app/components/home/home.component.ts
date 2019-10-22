import { Component, OnInit, AfterViewInit, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalService } from 'src/app/services/modal.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { isUndefined } from 'util';
import { isPlatformBrowser } from '@angular/common';

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
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }

  ngOnInit() {
    this.title.setTitle(`NXTDROP: Buy and Sell Sneakers in Canada`);
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this._platformId)) {
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

}
