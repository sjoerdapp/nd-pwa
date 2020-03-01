import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.scss']
})
export class OffersComponent implements OnInit {

  latestBids = [];

  constructor(
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.homeService.getLatestBid().subscribe(bids => {
      this.latestBids = bids;
    })
  }

}
