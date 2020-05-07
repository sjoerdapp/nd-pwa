import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss']
})
export class ListingsComponent implements OnInit {

  latestAsks = [];

  constructor(
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.homeService.getLatestAsk().subscribe(asks => {
      this.latestAsks = asks;
    })
  }

}
