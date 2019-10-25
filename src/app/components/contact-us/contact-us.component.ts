import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss']
})
export class ContactUsComponent implements OnInit {

  constructor(
    private title: Title,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.title.setTitle(`Contact Us | NXTDROP: Buy and Sell Sneakers in Canada`);
    this.seo.addTags('Contacts Us');
  }

}
