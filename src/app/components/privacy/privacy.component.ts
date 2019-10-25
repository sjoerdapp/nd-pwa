import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-privacy',
  templateUrl: './privacy.component.html',
  styleUrls: ['./privacy.component.scss']
})
export class PrivacyComponent implements OnInit {

  constructor(
    private title: Title,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.title.setTitle('Privacy | NXTDROP: Buy and Sell Sneakers in Canada');
    this.seo.addTags('Privacy');
  }

}
