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
    offers: 0,
    uid: '',
    email: ''
  };

  listings = [];
  offers = [];

  listingNav = true;

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

    const listingElement = document.getElementById('listingsBtn');
    const offerElement = document.getElementById('offersBtn');

    listingElement.addEventListener('mouseover', () => {
      listingElement.style.borderBottom = '4px solid #222021';
    });

    offerElement.addEventListener('mouseover', () => {
      offerElement.style.borderBottom = '4px solid #222021';
    });

    listingElement.addEventListener('mouseleave', () => {
      if (!this.listingNav) {
        listingElement.style.borderBottom = '2px solid #222021';
      }
    });

    offerElement.addEventListener('mouseleave', () => {
      if (this.listingNav) {
        offerElement.style.borderBottom = '2px solid #222021';
      }
    });

    this.showListings();
  }

  showListings() {
    document.getElementById('listingsBtn').style.borderBottom = '4px solid #222021';
    document.getElementById('offersBtn').style.borderBottom = '2px solid #222021';
    this.listingNav = true;

    if (!this.listings.length) {
      this.profileService.getUserListings().then(val => {
        val.subscribe(data => {
          this.listings = data;
          console.log(this.listings);
        });
      });
    }
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

  showOffers() {
    document.getElementById('offersBtn').style.borderBottom = '4px solid #222021';
    document.getElementById('listingsBtn').style.borderBottom = '2px solid #222021';
    this.listingNav = false;

    if (!this.offers.length) {
      this.profileService.getUserOffers().then(val => {
        val.subscribe(data => {
          this.offers = data;
          console.log(this.offers);
        });
      });
    }
  }

  moreOffers() {

  }

}
