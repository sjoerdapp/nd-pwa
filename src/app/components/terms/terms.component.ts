import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(
    private title: Title,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.title.setTitle('Terms | NXTDROP: Buy and Sell Sneakers in Canada');
    this.seo.addTags('Terms')
  }

}
