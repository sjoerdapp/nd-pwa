import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { isNullOrUndefined } from 'util';
import { SEOService } from 'src/app/services/seo.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  connected: boolean = false;
  duties: number = 21482;
  lastSale: any = {
    productID: '',
    model: '',
    assetURL: '',
    size: '',
    price: '',
    time: 0
  }

  constructor(
    private title: Title,
    private afs: AngularFirestore,
    private auth: AuthService,
    private seo: SEOService,
    private cookie: CookieService,
    private router: Router
  ) { }

  ngOnInit() {
    this.title.setTitle(`NXTDROP: Buy and Sell Sneakers in Canada`);
    this.seo.addTags('Home');

    this.auth.isConnected().then(res => {
      if (!isNullOrUndefined(res)) {
        this.connected = true;

        if (!this.cookie.check('phoneInvitation')) {
          this.router.navigate(['invite-a-friend']);
        }
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

    this.afs.collection(`lastSale`, ref => ref.where(`time`, `<=`, Date.now()).orderBy(`time`, `desc`).limit(1)).valueChanges().subscribe(res => {
      res.forEach(ele => {
        this.lastSale = ele;
      });
    });
  }
}
