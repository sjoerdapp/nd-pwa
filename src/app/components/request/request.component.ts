import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  constructor(
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle(`Request Product | NXTDROP: Sell and Buy Sneakers in Canada`);
    
  }

}
