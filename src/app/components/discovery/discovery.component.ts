import { Component, OnInit } from '@angular/core';
import { HomeService } from 'src/app/services/home.service';
import { Product } from 'src/app/models/product';

@Component({
  selector: 'app-discovery',
  templateUrl: './discovery.component.html',
  styleUrls: ['./discovery.component.scss']
})
export class DiscoveryComponent implements OnInit {

  discoveries;

  loading;

  end = false;

  constructor(
    private homeService: HomeService
  ) { }

  ngOnInit() {
    this.homeService.getDiscovery().subscribe(data => {
      this.discoveries = data
      console.log(this.discoveries);
    });
  }

  more() {
    this.loading = true;
    console.log('more() called');
    this.homeService.getDiscovery(this.discoveries.length).subscribe(data => {
      console.log(data.length);
      if (data.length == 0) {
        this.loading = false;
        this.end = true;
        console.log(this.end);
      } else {
        data.forEach(ele => {
          this.discoveries.push(ele);
        });
        this.loading = false;
      }
    });
  }

}
