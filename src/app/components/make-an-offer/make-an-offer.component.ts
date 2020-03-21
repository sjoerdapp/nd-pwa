import { Component, OnInit, NgZone, PLATFORM_ID, Inject } from '@angular/core';
import { SellService } from 'src/app/services/sell.service';
import { isUndefined, isNull, isNullOrUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from 'src/app/models/product';
import { OfferService } from 'src/app/services/offer.service';
import { AuthService } from 'src/app/services/auth.service';
import { Title } from '@angular/platform-browser';
import { SlackService } from 'src/app/services/slack.service';
import { isPlatformBrowser } from '@angular/common';
import { SEOService } from 'src/app/services/seo.service';
import * as algoliasearch from 'algoliasearch';
import { environment } from 'src/environments/environment';

declare var gtag: any;

@Component({
  selector: 'app-make-an-offer',
  templateUrl: './make-an-offer.component.html',
  styleUrls: ['./make-an-offer.component.scss']
})
export class MakeAnOfferComponent implements OnInit {

  // Algolia Set up
  algoliaClient = algoliasearch(environment.algolia.appId, environment.algolia.apiKey);
  index;
  results;
  inputLength = 0; // Length of search box input
  showResults = false;

  //Size Setup
  sizes: {[keys: string]: number[]} = {
    "M": [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12, 12.5, 13, 13.5, 14, 14.5, 15, 15.5, 16, 16.5, 17],
    "W": [4, 4.5, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12],
    "GS": [3.5, 4, 4.5, 5, 5.5, 6, 6.5, 7]
  };
  sizeType: string = 'M';
  sizeSuffix: string = '';

  offers = [];

  //Pages Boolean
  showHowItWorks: boolean = true;
  showSearch: boolean = false;
  showItem: boolean = false;

  // Offer Information
  pairCondition: string;
  pairPrice: number;
  pairSize: string;

  selectedPair: Product; // Listing Product object
  selectedSize: string = '';

  HighestBid: any = NaN;
  LowestAsk: any = NaN;
  currentBid: any = NaN;
  currentAsk: any = NaN;

  priceAdded = false;

  error: boolean;
  listed: boolean;
  loading: boolean;

  user: any;

  shippingCost: number = 15;
  total: number = 0;

  constructor(
    private sellService: SellService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private offerService: OfferService,
    private ngZone: NgZone,
    private auth: AuthService,
    private title: Title,
    private slack: SlackService,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.title.setTitle(`Make an Offer | NXTDROP: Buy and Sell Sneakers in Canada`);
    this.seo.addTags('Make an Offer');

    this.index = this.algoliaClient.initIndex(environment.algolia.index);

    this.activatedRoute.queryParams.subscribe(params => {
      if (!isUndefined(params.sneaker)) {
        this.selectPair(JSON.parse(params.sneaker), false);

        if (!isNullOrUndefined(params.size)) {
          this.selectSize(params.size);
        }
      }
    });

    this.auth.isConnected().then(res => {
      if (!isNull(res)) {
        this.user = res;
      }
    });
  }

  searchChanged(event) {
    this.inputLength = event.target.value.length;

    if (this.inputLength) {
      this.showResults = true;

      console.log(event.target.value);

      this.index.search({
        query: event.target.value
      }, (err, hits: any = {}) => {
        if (err) throw err;

        this.results = hits.hits;
        console.log(hits);
      });
    } else {
      this.showResults = false;
    }
  }

  selectPair(pair: Product, updateURL: boolean) {
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

    const patternW = new RegExp(/.\(W\)/);
    const patternGS = new RegExp(/.\(GS\)/);

    console.log(pair.model.toUpperCase());
    if (patternW.test(pair.model.toUpperCase())) {
      //console.log('Woman Size');
      this.sizeSuffix = 'W';
      this.sizeType = 'W';
    } else if (patternGS.test(pair.model.toUpperCase())) {
      //console.log(`GS size`);
      this.sizeSuffix = 'Y';
      this.sizeType = 'GS';
    } else {
      this.sizeType = 'M';
    }

    if (updateURL) {
      this.router.navigate([], {
        queryParams: { sneaker: JSON.stringify(this.selectedPair) }
      }).then(() => {
        this.goToItemPage();
      })
    }
  }

  getOffers() {
    if (this.offers.length < 1) {
      this.sizes[`${this.sizeType}`].forEach(ele => {
        let ask: any;
        const size = `US${ele}${this.sizeSuffix}`;

        this.sellService.getLowestListing(this.selectedPair.productID, 'new', size).subscribe(askdata => {
          ask = askdata[0];

          const data = {
            LowestAsk: ask,
            size: size
          }

          this.offers.push(data);

          if (this.sizes[`${this.sizeType}`].length === this.offers.length) {
            this.getProductStats();
          }
        });
      });
    }
  }

  getProductStats() {
    this.sellService.getLowestListing(this.selectedPair.productID, 'new').subscribe(response => {
      this.LowestAsk = response[0];

      this.sellService.getHighestOffer(this.selectedPair.productID, 'new').subscribe(res => {
        this.HighestBid = res[0];

        if (!this.selectedSize) {
          this.currentAsk = this.LowestAsk;
          this.currentBid = this.HighestBid;
        }
      });
    });
  }

  private getPrice() {
    const price = (document.getElementById('input') as HTMLInputElement).value;
    return +price;
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
        return this.router.navigate([`/product/${this.selectedPair.productID}`]);
      });
    }, 2500);
  }

  nextPage() {
    if (isNullOrUndefined(this.selectedPair)) {
      this.showHowItWorks = false;
      this.showSearch = true;
    } else {
      this.goToItemPage();
    }
  }

  goToItemPage() {
    this.showSearch = false;
    this.showHowItWorks = false;
    this.showItem = true;

    this.getOffers();
  }

  submitOffer() {
    this.pairPrice = this.getPrice();
    this.pairSize = this.selectedSize;
    this.loading = true;

    if (isNaN(this.pairPrice)) {
      this.addError();
      return;
    }

    this.offerService.addOffer(this.selectedPair, 'new', this.pairPrice, this.pairSize).then(res => {
      if (res) {
        if (isPlatformBrowser(this._platformId)) {
          gtag('event', 'ask', {
            'event_category': 'engagement',
            'event_label': this.selectedPair.model,
            'event_value': this.pairPrice
          });
        }

        const msg = `${this.user.uid} placed an offer for ${this.selectedPair.model}, size ${this.pairSize} at ${this.pairPrice}`;
        this.slack.sendAlert('offers', msg);

        this.addListed();
      } else {
        this.addError();
      }
    })
  }

  priceChanges($event) {
    if ($event.target.value != `` && +$event.target.value >= 40) {
      this.priceAdded = true;
      this.pairPrice = +$event.target.value;

      this.calculateTotal();
    } else {
      this.priceAdded = false;
      this.pairPrice = NaN;
    }
  }

  calculateTotal() {
    this.total = this.shippingCost + this.pairPrice;
  }

  buyNow() {
    this.ngZone.run(() => {
      this.router.navigate([`../../checkout`], {
        queryParams: { product: this.currentAsk.listingID, sell: false }
      });
    });
  }

  selectSize(size: string) {
    this.selectedSize = size;

    this.sellService.getHighestOffer(this.selectedPair.productID, 'new', this.selectedSize).subscribe(res => {
      if (isNullOrUndefined(res[0])) {
        this.currentBid = NaN;
      } else {
        this.currentBid = res[0];
      }
    });

    this.sellService.getLowestListing(this.selectedPair.productID, 'new', this.selectedSize).subscribe(res => {
      if (isNullOrUndefined(res[0])) {
        this.currentAsk = NaN;
      } else {
        this.currentAsk = res[0];
      }
    });
  }

  changeSize() {
    this.selectedSize = '';
    this.currentBid = this.HighestBid;
    this.currentAsk = this.LowestAsk;
    this.priceAdded = false;
    this.pairPrice = NaN;
    this.shippingCost = 0;
    this.total = 0;
  }

}
