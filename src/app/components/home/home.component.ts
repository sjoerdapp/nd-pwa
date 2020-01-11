import { Component, OnInit, AfterViewInit, ChangeDetectorRef, PLATFORM_ID, Inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ModalService } from 'src/app/services/modal.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { isUndefined, isNullOrUndefined } from 'util';
import { isPlatformBrowser } from '@angular/common';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  connected: boolean = false;
  duties: number = 21482;

  constructor(
    private title: Title,
    private modalService: ModalService,
    private ref: ChangeDetectorRef,
    private afs: AngularFirestore,
    private auth: AuthService,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.title.setTitle(`NXTDROP: Buy and Sell Sneakers in Canada`);
    this.seo.addTags('Home');

    this.auth.isConnected().then(res => {
      if(!isNullOrUndefined(res)) {
        this.connected = true;
      } else {
        this.connected = false;
      }
    });

    this.afs.collection(`transactions`).ref.where('boughtAt', '>=', 1577854800000).get().then(res => {
      let prices = 0;

      res.forEach(ele => {
        prices += ele.data().total;
      });

      this.duties += prices;
    });

    this.afs.collection(`transactions`).ref.where('soldAt', '>=', 1577854800000).get().then(res => {
      let prices = 0;

      res.forEach(ele => {
        prices += ele.data().total;
      });

      this.duties += prices;
    });
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
