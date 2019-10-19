import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SpecialDropService } from '../special-drop.service';
import { AuthService } from 'src/app/services/auth.service';
import { isUndefined } from 'util';

@Component({
  selector: 'app-drop',
  templateUrl: './drop.component.html',
  styleUrls: ['./drop.component.scss', '../../product/product.component.scss']
})
export class DropComponent implements OnInit {

  drops = [
    {
      assetURL: '../../../../assets/AndrewSheerWebsite.png',
      model: 'Nike Air Force 1 \'Air Scheer\' by TheOriginalShoeChef, US9',
      productID: 'air-force-1-air-scheer'
    },
    {
      assetURL: '../../../../assets/JustinTrudeauWebsite.png',
      model: 'Nike Air Force 1 \'Air Trudeau\' by TheOriginalShoeChef, US9',
      productID: 'air-force-1-air-trudeau'
    }
  ]

  productInfo = {
    productID: '',
    assetURL: '',
    model: ''
  };

  highestBid = 250;
  entriesLeft = 0;
  userBid = 0;

  validSize = false;
  validPrice = false;
  loading = false;
  error = false;
  submitted = false;

  connected = true;

  constructor(
    private router: Router,
    private specDrop: SpecialDropService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    const url = this.router.url.split('/');

    if (url.length != 3) {
      this.router.navigate(['page-not-found']);
    } else {
      //console.log(url[2]);
      if (url[2] == this.drops[0].productID) {
        this.productInfo = this.drops[0];
      } else if (url[2] == this.drops[1].productID) {
        this.productInfo = this.drops[1];
      } else {
        this.router.navigate(['page-not-found']);
      }
    }

    this.getStats();

    this.specDrop.getNumBid(this.productInfo.productID).subscribe((payload: any) => {
      if (!isUndefined(payload)) {
        this.entriesLeft = payload.numBid;
      }
    });

    this.auth.isConnected().then(res => {
      if (!res) {
        this.connected = false;
      }
    })
  }

  getStats() {
    this.specDrop.getHighestBid(this.productInfo.productID).then(payload => {
      this.highestBid = payload.docs[0].data().price;
    }).catch((err) => {
      console.error(err);
    });

    this.specDrop.getNumUserBid(this.productInfo.productID).then(payload => {
      if (!payload.empty) {
        this.userBid = payload.size;
      }
    });
  }

  /*sizeChanges($event) {
    const size = $event.target.value;

    if (size != 'none') {
      this.validSize = true;
    } else {
      this.validSize = false;
    }
  }*/

  priceChanges($event) {
    const price = $event.target.value;
    const treshold = this.highestBid + 1;

    if (price >= treshold && this.entriesLeft != 200) {
      this.validPrice = true;
    } else {
      this.validPrice = false;
    }
  }

  submitBid() {
    if (!this.connected) {
      this.router.navigate(['login']);
    }

    if (this.validPrice) {
      this.loading = true;
      const price = +(document.getElementById('sell-price-input') as HTMLInputElement).value;
      //const size = (document.getElementById('item-size') as HTMLInputElement).value;

      let submit;

      if (this.userBid > 0) {
        submit = this.specDrop.submitBid(price, this.productInfo.productID, true);
      } else {
        submit = this.specDrop.submitBid(price, this.productInfo.productID, false);
      }

      submit.then(res => {
        this.loading = false;
        if (res) {
          this.submitted = true;
          this.getStats();
        } else {
          this.error = true;
        }
      })
    }

    setTimeout(() => {
      this.error = false;
      this.submitted = false;
    }, 2000);
  }

}
