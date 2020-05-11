import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from 'src/app/services/auth.service';
import { isNullOrUndefined } from 'util';
import { MetaService } from 'src/app/services/meta.service';
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
    private seo: MetaService,
    private cookie: CookieService,
    private router: Router
  ) { }

  ngOnInit() {
    this.title.setTitle(`NXTDROP: Buy and Sell Sneakers in Canada`);
    this.seo.addTags('Home');

    this.auth.isConnected().then(res => {
      if (!isNullOrUndefined(res)) {
        this.connected = true;

        //console.log(res.providerData)

        /*if (!this.cookie.check('phoneInvitation')) {
          this.router.navigate(['invite-a-friend']);
        }*/
      } else {
        this.connected = false;
      }
    });

    this.afs.collection(`transactions`).get().subscribe(res => {
      let prices: number = 0;

      res.docs.forEach(ele => {
        if (ele.data().paymentID != '' && !ele.data().status.cancelled) {
          prices += ele.data().total;
        }
      });

      prices = prices * .23;
      
      this.duties += prices;
    });

    this.afs.collection(`transactions`, ref => ref.where('status.cancelled', '==', false).orderBy(`purchaseDate`, `desc`).limit(1)).valueChanges().subscribe(res => {
      res.forEach(ele => {
        this.lastSale = ele;
        //console.log(this.lastSale)
      });
    });
  }
}
