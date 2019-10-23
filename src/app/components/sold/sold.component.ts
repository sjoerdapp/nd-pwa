import { Component, OnInit } from '@angular/core';
import { Transaction } from 'src/app/models/transaction';
import { ActivatedRoute } from '@angular/router';
import { TransactionService } from 'src/app/services/transaction.service';
import { isNullOrUndefined } from 'util';
import { Title } from '@angular/platform-browser';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-sold',
  templateUrl: './sold.component.html',
  styleUrls: ['./sold.component.scss']
})
export class SoldComponent implements OnInit {

  transactionID: string;
  transaction: Transaction = {
    assetURL: '',
    soldAt: 0,
    buyerID: '',
    condition: '',
    listedAt: 0,
    offerID: '',
    model: '',
    paymentID: '',
    price: 0,
    productID: '',
    sellerID: '',
    shippingCost: 0,
    size: '',
    status: {},
    type: ''

  };
  error = false;

  constructor(
    private route: ActivatedRoute,
    private TranService: TransactionService,
    private title: Title,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.title.setTitle(`Item Sold | NXTDROP: Sell and Buy Sneakers in Canada`);
    this.seo.addTags('Item Sold');
    
    this.transactionID = this.route.snapshot.queryParams.transactionID;

    if (isNullOrUndefined(this.transactionID)) {
      this.error = true;
    } else {
      this.TranService.getTransaction(this.transactionID).subscribe(data => {
        this.transaction = data;

        if (this.transaction.type !== 'sold') {
          this.error = true;
        }
        // console.log(this.transaction);
      }) 
    }
  }

  fee() {
    let subtotal = this.transaction.price;

    return subtotal * 0.095;
  }

  processing() {
    let subtotal = this.transaction.price;

    return subtotal * 0.03;
  }

}
