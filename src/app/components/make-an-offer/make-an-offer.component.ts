import { Component, OnInit, NgZone } from '@angular/core';
import { SellService } from 'src/app/services/sell.service';
import { isUndefined } from 'util';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { OfferService } from 'src/app/services/offer.service';

@Component({
  selector: 'app-make-an-offer',
  templateUrl: './make-an-offer.component.html',
  styleUrls: ['./make-an-offer.component.scss']
})
export class MakeAnOfferComponent implements OnInit {

  nextToPage2 = false;

  pairCondition: string;
  pairSize: string;
  pairPrice: number;

  selectedPair: Product;

  highestOffer: number;
  lowestListing: number;

  priceAdded = false;

  error: boolean;
  listed: boolean;
  loading: boolean;
  showFinish = true;

  constructor(
    private sellService: SellService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private offerService: OfferService, 
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(params => {
      if (!isUndefined(params.sneaker)) {
        this.selectedPair = JSON.parse(params.sneaker); 
      } else {
        this.router.navigate(['/home']);
      }
    });
  }

  addError() {
    this.loading = false;
    this.error = true;

    setTimeout(() => {
      this.error = false;
    }, 2000);
  }

  addListed() {
    this.loading = false;
    this.listed = true;

    setTimeout(() => {
      return this.ngZone.run(() => {
        return this.router.navigate(['../profile']);
      });
    }, 2000);
  }

  submitOffer() {
    this.loading = true;

    if (isNaN(this.pairPrice)) {
      this.addError();
      return;
    }

    this.offerService.addOffer(this.selectedPair, this.pairCondition, this.pairPrice, this.pairSize).then(res => {
      if (res) {
        this.addListed();
      } else {
        this.addError();
      }
    })
  }

  radioHandler(event: any) {
    this.pairCondition = event.target.value;
    this.disableBtn();
  }

  disableBtn() {
    // console.log(`disableBtn() called`);
    if (!isUndefined(this.pairCondition) && !isUndefined(this.pairSize) && this.pairSize != 'none') {
      this.nextToPage2 = true;
    } else {
      this.nextToPage2 = false;
    }
  }

  sizeChanges() {
    this.pairSize = (document.getElementById('item-size') as HTMLInputElement).value;
    this.disableBtn()
  }

  priceChanges($event) {
    if ($event.target.value != ``) {
      this.priceAdded = true;
      this.pairPrice = +$event.target.value;
    } else {
      this.priceAdded = false;
      this.pairPrice = NaN;
    }
    this.showFinishBtn();
    console.log(this.showFinish);
  }

  showFinishBtn() {
    if (this.pairPrice > this.lowestListing) {
      if (this.lowestListing != -1) {
        this.showFinish = false;
      } else {
        this.showFinish = true;
      }
    } else {
      if (this.lowestListing != -1) {
        this.showFinish = true;
      } else {
        this.showFinish = true;
      }
    }
  }

  goToPage1() {
    let element = document.getElementById('offer-page-1');
    element.style.display = 'block';

    element = document.getElementById('offer-page-2');
    element.style.display = 'none';
  }

  goToPage2() {
    let element = document.getElementById('offer-page-1');
    element.style.display = 'none';

    element = document.getElementById('offer-page-2');
    element.style.display = 'block';

    this.sellService.getHighestOffer(this.selectedPair.productID, this.pairCondition, this.pairSize).subscribe(data => {
      if (!data.empty) {
        data.forEach(val => {
          this.highestOffer = val.data().price;
        });
      } else {
        this.highestOffer = -1;
      }
    });

    this.sellService.getLowestListing(this.selectedPair.productID, this.pairCondition, this.pairSize).subscribe(data => {
      if (!data.empty) {
        data.forEach(val => {
          this.lowestListing = val.data().price;
        });
      } else {
        this.lowestListing = -1;
      }
    });

    console.log(this.selectedPair);
  }

}
