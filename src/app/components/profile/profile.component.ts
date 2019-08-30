import { Component, OnInit } from '@angular/core';
import { ProfileService } from 'src/app/services/profile.service';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  dashInfo: User = {
    sold: 0,
    listed: 0,
    ordered: 0,
    counterOffer: 0,
    uid: '',
    email: ''
  };

  listings = [];
  count = 6;

  loading = false;

  constructor(
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.profileService.getUserData().then(val => {
      val.subscribe(data => {
        this.dashInfo = data;
      });
    });

    this.profileService.getUserListings().then(val => {
      val.subscribe(data => {
        this.listings = data;
        console.log(this.listings);
      });
    });
  }

  moreListings() {
    this.profileService.getUserListings(this.listings[this.listings.length - 1].timestamp)
      .then(val => {
        val.subscribe(data => {
          data.forEach(element => {
            this.listings.push(element);
          });
          console.log(this.listings);
        });
      });
  }

}
