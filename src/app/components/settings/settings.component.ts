import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  constructor(
    private title: Title,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.title.setTitle(`Settings | NXTDROP: Sell and Buy Sneakers in Canada`);
    this.seo.addTags('Settings');
  }

}
