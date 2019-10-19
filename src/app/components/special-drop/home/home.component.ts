import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-specdrop-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss', '../../discovery/discovery.component.scss']
})
export class SpecialDropHomeComponent implements OnInit {

  drops = [
    {
      assetURL: '../../../../assets/AndrewSheerWebsite.png',
      model: 'Air Force 1 \'Air Scheer\' by TheOriginalShoeChef',
      productID: 'air-force-1-air-scheer'
    },
    {
      assetURL: '../../../../assets/JustinTrudeauWebsite.png',
      model: 'Air Force 1 \'Air Trudeau\' by TheOriginalShoeChef',
      productID: 'air-force-1-air-trudeau'
    }
  ]

  constructor() { }

  ngOnInit() {
  }

}
