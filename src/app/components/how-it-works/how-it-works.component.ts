import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SEOService } from 'src/app/services/seo.service';

@Component({
    selector: 'app-how-it-works',
    templateUrl: './how-it-works.component.html',
    styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent implements OnInit {

    constructor(
        private title: Title,
        private seo: SEOService
    ) { }

    ngOnInit() {
        this.title.setTitle(`How It Wokrs | NXTDROP: Buy and Sell Sneakers in Canada`);
        this.seo.addTags('How It Works');
    }

}