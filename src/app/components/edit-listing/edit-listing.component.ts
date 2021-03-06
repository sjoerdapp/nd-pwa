import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';
import { SellService } from 'src/app/services/sell.service';
import { isUndefined } from 'util';
import { Title } from '@angular/platform-browser';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-edit-listing',
  templateUrl: './edit-listing.component.html',
  styleUrls: ['./edit-listing.component.scss']
})
export class EditListingComponent implements OnInit {

  listingID: string;

  offerInfo;

  loading = false;
  error = false;
  updated = false;

  conditionChanged = false;
  priceChanged = false;
  sizeChanged = false;

  highestOffer: number;

  curCondition;
  curPrice;
  curSize;

  isWomen = false;
  isGS = false;

  consignmentFee = 0;
  paymentProcessingFee =  0;
  payout = 0;

  source: string = '../../';

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private ngZone: NgZone,
    private router: Router,
    private sellService: SellService,
    private title: Title,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.title.setTitle('Edit Listing | NXTDROP: Sell and Buy Authentic Sneakers in Canada');
    this.seo.addTags('Edit Listing');
    
    this.listingID = this.route.snapshot.params.id;
    this.source = this.route.snapshot.queryParamMap.get('source');
    this.offerInfo = this.profileService.getListing(this.listingID).then(val => {
      val.subscribe(data => {
        if (isUndefined(data)) {
          this.router.navigate([`page-not-found`]);
        } else {
          this.offerInfo = data.data();
          (document.getElementById('radio-' + this.offerInfo.condition) as HTMLInputElement).checked = true;
          this.curCondition = this.offerInfo.condition;
          this.curPrice = this.offerInfo.price;
          this.curSize = this.offerInfo.size;

          this.shoeSizes();
          this.calculateSellerFees();

          this.sellService.getHighestOffer(this.offerInfo.productID, this.offerInfo.condition, this.offerInfo.size).subscribe(data => {
            if (!data.empty) {
              data.forEach(val => {
                this.highestOffer = val.data().price;
              });
            } else {
              this.highestOffer = 0;
            }
          });
        }
      });
    });
  }

  private shoeSizes() {
    const patternW = new RegExp(/.\(W\)/);
    const patternGS = new RegExp(/.\(GS\)/);
    let type = 'item-size';

    //console.log(this.offerInfo.model.toUpperCase());
    if (patternW.test(this.offerInfo.model.toUpperCase())) {
      //console.log(`women size`);
      this.isWomen = true;
      type = 'item-size-women';
    } else if (patternGS.test(this.offerInfo.model.toUpperCase())) {
      //console.log(`GS size`);
      this.isGS = true;
      type = 'item-size-gs';
    } else {
      type = 'item-size';
    }

    setTimeout(() => {
      (document.getElementById(type) as HTMLInputElement).value = this.offerInfo.size;
    }, 500);
  }

  conditionChanges($event) {
    if (this.offerInfo.condition != $event.target.value && this.conditionChanged == false) {
      this.conditionChanged = true;
    } else if (this.offerInfo.condition == $event.target.value && this.conditionChanged == true) {
      this.conditionChanged = false;
    }

    this.curCondition = $event.target.value;
  }

  priceChanges($event) {
    if (this.offerInfo.price != $event.target.value && this.priceChanged == false) {
      this.priceChanged = true;
    } else if ((this.offerInfo.price == $event.target.value || $event.target.value == '') && this.priceChanged == true) {
      this.priceChanged = false;
    }

    this.curPrice = +$event.target.value;
    this.calculateSellerFees();
  }

  sizeChanges($event) {
    if (this.offerInfo.size != $event.target.value && this.sizeChanged == false) {
      this.sizeChanged = true;
    } else if (this.offerInfo.size == $event.target.value && this.sizeChanged == true) {
      this.sizeChanged = false;
    }

    this.curSize = $event.target.value;
  }

  private calculateSellerFees() {
    this.consignmentFee = this.curPrice * 0.095;
    this.paymentProcessingFee = this.curPrice * 0.03;
    this.payout = this.curPrice - this.consignmentFee - this.paymentProcessingFee;
  }

  updateListing() {
    const condition = this.curCondition;
    const price = this.curPrice;
    const size = this.curSize;

    if (this.conditionChanged || this.priceChanged || this.sizeChanged) {
      this.loading = true;

      if (isNaN(price)) {
        this.updateError();
        return;
      }

      this.profileService.updateListing(this.offerInfo.listingID, this.offerInfo.productID, this.offerInfo.price, condition, price, size).then((res) => {
        if (res) {
          this.udpateSuccessful();
        } else {
          this.updateError();
        }
      });
    }
  }

  deleteListing() {
    this.profileService.deleteListing(this.offerInfo.listingID, this.offerInfo.productID, this.offerInfo.price)
      .then((res) => {
        this.offerInfo = [];
        if (res) {
          return this.ngZone.run(() => {
            return this.router.navigate(['../../profile']);
          });
        }
      });
  }

  updateError() {
    this.loading = false;
    this.error = true;

    setTimeout(() => {
      this.error = false;
    }, 2500);
  }

  udpateSuccessful() {
    this.loading = false;
    this.updated = true;

    setTimeout(() => {
      this.updated = false;
      this.conditionChanged = false;
      this.priceChanged = false;
      this.sizeChanged = false;
    }, 2500);
  }

}
