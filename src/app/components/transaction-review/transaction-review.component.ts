import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { TransactionService } from 'src/app/services/transaction.service';
import { Transaction } from 'src/app/models/transaction';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-transaction-review',
  templateUrl: './transaction-review.component.html',
  styleUrls: ['./transaction-review.component.scss']
})
export class TransactionReviewComponent implements OnInit {

  transactionID: string;
  transaction: Transaction = {
    assetURL: '',
    boughtAt: 0,
    buyerID: '',
    condition: '',
    listedAt: 0,
    listingID: '',
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
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle(`Transaction Review | NXTDROP: Sell and Buy Sneakers in Canada`);
    this.transactionID = this.route.snapshot.queryParams.transactionID;

    if (isNullOrUndefined(this.transactionID)) {
      this.error = true;
    } else {
      this.TranService.getTransaction(this.transactionID).subscribe(data => {
        this.transaction = data;

        if (this.transaction.type !== 'bought') {
          this.error = true;
        }
        // console.log(this.transaction);
      }) 
    }
  }

}
