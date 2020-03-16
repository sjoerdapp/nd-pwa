import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { TransactionService } from 'src/app/services/transaction.service';
import { Transaction } from 'src/app/models/transaction';
import { Title } from '@angular/platform-browser';
import { SEOService } from 'src/app/services/seo.service';
import { AuthService } from 'src/app/services/auth.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-transaction-review',
  templateUrl: './transaction-review.component.html',
  styleUrls: ['./transaction-review.component.scss']
})
export class TransactionReviewComponent implements OnInit {

  transactionID: string;
  transaction: Transaction;
  error = false;

  user: User;

  // boolean
  confLoading: boolean = false;
  cancelLoading: boolean = false;
  confError: boolean = false;
  cancelError: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private TranService: TransactionService,
    private title: Title,
    private seo: SEOService,
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.title.setTitle(`Transaction Review | NXTDROP: Sell and Buy Sneakers in Canada`);
    this.seo.addTags('Transaction Review');

    this.auth.isConnected().then(res => {
      if (isNullOrUndefined(res) || isNullOrUndefined(this.route.snapshot.queryParams.transactionID)) {
        this.error = true;
      } else {
        this.transactionID = this.route.snapshot.queryParams.transactionID;
        this.getData();
        this.getUserData(res.uid);
      }
    });

    this.removeFreeShipping();
  }

  getData() {
    this.TranService.getTransaction(this.transactionID).subscribe(data => {
      this.transaction = data;

      if (this.transaction.type !== 'bought' && this.transaction.type !== 'sold') {
        this.error = true;
      }
      // console.log(this.transaction);
    })
  }

  getUserData(UID: string) {
    this.auth.getUserData(UID).subscribe(userData => {
      this.user = userData[0];
    });
  }

  removeFreeShipping() {
    this.TranService.removeFreeShipping();
  }

  confirmOrder() {
    this.confLoading = true;

    if (!isNullOrUndefined(this.user.shippingAddress)) {
      this.router.navigate(['/profile']);
    } else {
      this.TranService.confirmOrder(this.transactionID).then(res => {
        this.confLoading = false;
        if (!res) {
          this.confError = true;
        }

        setTimeout(() => {
          this.confError = false
        }, 1500)
      })
    }
  }

  cancelOrder() {
    let cancellation;
    this.cancelLoading = true;

    if (this.user.uid === this.transaction.buyerID) {
      cancellation = this.TranService.cancelOrder(this.transactionID, this.transaction, false);
    } else {
      cancellation = this.TranService.cancelOrder(this.transactionID, this.transaction, true);
    }

    cancellation.then(res => {
      this.cancelLoading = false;
      if (!res) {
        this.cancelError = true;
      }

      setTimeout(() => {
        this.cancelError = false;
      }, 1500)
    })
  }

}
