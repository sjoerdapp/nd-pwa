import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from 'src/app/services/profile.service';

@Component({
  selector: 'app-edit-offer',
  templateUrl: './edit-offer.component.html',
  styleUrls: ['./edit-offer.component.scss']
})
export class EditOfferComponent implements OnInit {

  listingID: string;

  offerInfo;

  constructor(
    private route: ActivatedRoute,
    private profileService: ProfileService
  ) { }

  ngOnInit() {
    this.listingID = this.route.snapshot.params.id;
    this.offerInfo = this.profileService.getOffer(this.listingID).then(val => {
      val.subscribe(data => {
        this.offerInfo = data;
        (document.getElementById('item-size') as HTMLInputElement).value = this.offerInfo.size;
        (document.getElementById('radio-' + this.offerInfo.condition) as HTMLInputElement).checked = true;
      });
    });
  }

}
