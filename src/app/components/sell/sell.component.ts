import { Component, OnInit } from '@angular/core';
import { SellService } from 'src/app/services/sell.service';
import { environment } from '../../../environments/environment';
import { Product } from 'src/app/models/product';

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

  constructor(
    private sellService: SellService
  ) { }

  ngOnInit() {
  }

  submitListing() {
    this.pairPrice = this.getPrice();
    this.pairSize = this.getSize();

    this.sellService.addListing(this.selectedPair, this.pairCondition, this.pairPrice, this.pairSize);
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

}
