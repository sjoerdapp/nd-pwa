import { Component, OnInit, NgZone } from '@angular/core';
import { SellService } from 'src/app/services/sell.service';
import { environment } from '../../../environments/environment';
import { Product } from 'src/app/models/product';
import { Router } from '@angular/router';

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

  // Listing Information
  pairCondition: string;
  pairPrice: number;
  pairSize: string;

  loading = false;
  listed = false;
  error = false;

  constructor(
    private sellService: SellService,
    private ngZone: NgZone,
    private router: Router
  ) { }

  ngOnInit() {
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
  }

  private getPrice() {
    const price = (document.getElementById('sell-price-input') as HTMLInputElement).value;
    return +price;
  }

  private getSize() {
    return (document.getElementById('item-size') as HTMLInputElement).value;
  }

  selectPair(pair) {
    console.log(pair);
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

}
