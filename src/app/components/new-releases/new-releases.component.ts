import { Component, OnInit } from '@angular/core';
import { HomeService } from '../../services/home.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-new-releases',
  templateUrl: './new-releases.component.html',
  styleUrls: ['./new-releases.component.scss']
})
export class NewReleasesComponent implements OnInit {

  newReleases;

  constructor(
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.homeService.getNewReleases().subscribe(data => this.newReleases = data);
  }

}
