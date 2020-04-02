import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MetaService } from 'src/app/services/meta.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  constructor(
    private title: Title,
    private meta: MetaService
  ) { }

  ngOnInit() {
    this.title.setTitle('Privacy | NXTDROP: Buy and Sell Sneakers in Canada');
    this.meta.addTags('Privacy');
  }

}
