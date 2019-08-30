import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss']
})
export class EditOfferComponent implements OnInit {

  listingID: string;

  offerInfo;

  loading = false;
  error = false;
  updated = false;

  conditionChanged = false;
  priceChanged = false;
  sizeChanged = false;

  curCondition;
  curPrice;
  curSize;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService,
    private ngZone: NgZone,
    private router: Router
  ) { }

  ngOnInit() {
    this.listingID = this.route.snapshot.params.id;
    this.offerInfo = this.profileService.getOffer(this.listingID).then(val => {
      val.subscribe(data => {
        this.offerInfo = data;
        (document.getElementById('item-size') as HTMLInputElement).value = this.offerInfo.size;
        (document.getElementById('radio-' + this.offerInfo.condition) as HTMLInputElement).checked = true;
        this.curCondition = this.offerInfo.condition;
        this.curPrice = this.offerInfo.price;
        this.curSize = this.offerInfo.size;
      });
    });
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
  }

  sizeChanges($event) {
    if (this.offerInfo.size != $event.target.value && this.sizeChanged == false) {
      this.sizeChanged = true;
    } else if (this.offerInfo.size == $event.target.value && this.sizeChanged == true) {
      this.sizeChanged = false;
    }

    this.curSize = $event.target.value;
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

      this.profileService.updateOffer(this.offerInfo.listingID, this.offerInfo.productID, condition, price, size).then((res) => {
        if (res) {
          this.udpateSuccessful();
        } else {
          this.updateError();
        }
      });
    }
  }

  deleteListing() {
    this.profileService.deleteOffer(this.offerInfo.listingID, this.offerInfo.productID, this.offerInfo.price)
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
