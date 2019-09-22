import { Component, OnInit, NgZone } from '@angular/core';
import { SellService } from 'src/app/services/sell.service';
import { environment } from '../../../environments/environment';
import { Product } from 'src/app/models/product';
import { Router, ActivatedRoute } from '@angular/router';
import { isUndefined, isNullOrUndefined, isNull } from 'util';
import { AuthService } from 'src/app/services/auth.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sell',
  templateUrl: './sell.component.html',
  styleUrls: ['./sell.component.scss']
})
export class SellComponent implements OnInit {

  searchConfig = {
    ...environment.algolia,
    indexName: 'test_PRODUCTS'
  };
  showResults = false;

  inputLength = 0; // Length of search box input

  selectedPair: Product; // Listing Product object

  highestOffer: number;
  lowestListing: number;

  // Listing Information
  pairCondition: string;
  pairPrice: number;
  pairSize: string;

  nextToPage4 = false;
  priceAdded = false;

  // Page 4 boolean
  loading = false;
  listed = false;
  error = false;

  constructor(
    private sellService: SellService,
    private ngZone: NgZone,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle(`Sell | NXTDROP: Sell and Buy Sneakers in Canada`);
    this.activatedRoute.queryParams.subscribe(params => {
      if (!isUndefined(params.sneaker)) {
        let element = document.getElementById('sell-page-1');
        element.style.display = 'none';

        document.getElementById('page-2-back-btn').style.display = 'none';
        document.getElementById('page-2-back-btn-alt').style.display = 'block';

        const pair = JSON.parse(params.sneaker);
        this.selectPair(pair);
      }
    });

    this.auth.isConnected().then(res => {
      if(isNull(res)) {
        this.router.navigate([`login`]);
      }

      if (isNullOrUndefined(res.phoneNumber)) {
        if (this.activatedRoute.snapshot.queryParams.sneaker) {
          this.router.navigate(['../phone-verification'], {
            queryParams: { redirectTo: `product/${this.selectedPair.productID}` }
          });
        } else {
          this.router.navigate(['../phone-verification'], {
            queryParams: { redirectTo: `sell` }
          });
        }
      }
    });
  }

  submitListing() {
    this.pairPrice = this.getPrice();
    this.pairSize = this.getSize();
    this.loading = true;

    if (isNaN(this.pairPrice)) {
      this.addError();
      return;
    }

    this.sellService.addListing(this.selectedPair, this.pairCondition, this.pairPrice, this.pairSize)
      .then((res) => {
        if (res) {
          this.addListed();
        } else {
          this.addError();
        }
      });
  }

  radioHandler(event: any) {
    this.pairCondition = event.target.value;
    this.disableBtn();
  }

  sizeChanges($event) {
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
  }

  private getPrice() {
    const price = (document.getElementById('sell-price-input') as HTMLInputElement).value;
    return +price;
  }

  private getSize() {
    return (document.getElementById('item-size') as HTMLInputElement).value;
  }

  selectPair(pair) {
    this.selectedPair = {
      productID: pair.productID,
      brand: pair.brand,
      line: pair.line,
      model: pair.model,
      assetURL: pair.assetURL,
      colorway: pair.colorway,
      yearMade: pair.yearMade,
      type: pair.type
    };

    let element = document.getElementById('sell-page-2');
    element.style.display = 'none';

    element = document.getElementById('sell-page-3');
    element.style.display = 'block';
  }

  goToPage2(firstPage: boolean) {
    if (firstPage) {
      let element = document.getElementById('sell-page-1');
      element.style.display = 'none';

      element = document.getElementById('sell-page-2');
      element.style.display = 'block';
    } else {
      let element = document.getElementById('sell-page-3');
      element.style.display = 'none';

      element = document.getElementById('sell-page-2');
      element.style.display = 'block';
    }
  }

  goToPage3() {
    let element = document.getElementById('sell-page-3');
    element.style.display = 'block';

    element = document.getElementById('sell-page-4');
    element.style.display = 'none';
  }

  goToPage4() {
    let element = document.getElementById('sell-page-3');
    element.style.display = 'none';

    element = document.getElementById('sell-page-4');
    element.style.display = 'block';

    this.sellService.getHighestOffer(this.selectedPair.productID, this.pairCondition, this.pairSize).subscribe(data => {
      if (!data.empty) {
        data.forEach(val => {
          this.highestOffer = val.data().price;
        });
      } else {
        this.highestOffer = 0;
      }
    });

    this.sellService.getLowestListing(this.selectedPair.productID, this.pairCondition, this.pairSize).subscribe(data => {
      if (!data.empty) {
        data.forEach(val => {
          this.lowestListing = val.data().price;
        });
      } else {
        this.lowestListing = 0;
      }
    });

    // console.log(`highestOffer: ${this.highestOffer} and lowestListing: ${this.lowestListing}`);
  }

  searchChanged(query) {
    if (query.length !== undefined) {
      this.inputLength = query.length;
    }

    if (this.inputLength) {
      this.showResults = true;
    } else {
      this.showResults = false;
    }
  }

  addError() {
    this.loading = false;
    this.error = true;

    setTimeout(() => {
      this.error = false;
    }, 2500);
  }

  addListed() {
    this.loading = false;
    this.listed = true;

    setTimeout(() => {
      return this.ngZone.run(() => {
        return this.router.navigate(['../profile']);
      });
    }, 2500);
  }

  disableBtn() {
    console.log(`disableBtn() called`);
    if (!isUndefined(this.pairCondition) && !isUndefined(this.pairSize) && this.pairSize != 'none') {
      this.nextToPage4 = true;
    } else {
      this.nextToPage4 = false;
    }
  }

}
