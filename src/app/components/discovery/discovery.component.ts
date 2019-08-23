import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.component.html',
  styleUrls: ['./discovery.component.scss']
})
export class DiscoveryComponent implements OnInit {

  discoveries: Product[];

  constructor(
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.homeService.getDiscovery().subscribe(data => this.discoveries = data);
  }

}
