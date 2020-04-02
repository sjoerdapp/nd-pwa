import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { MetaService } from 'src/app/services/meta.service';

@Component({
  selector: 'app-terms',
  templateUrl: './terms.component.html',
  styleUrls: ['./terms.component.scss']
})
export class TermsComponent implements OnInit {

  constructor(
    private title: Title,
    private meta: MetaService
  ) { }

  ngOnInit() {
    this.title.setTitle('Terms | NXTDROP: Buy and Sell Sneakers in Canada');
    this.meta.addTags('Terms')
  }

}
