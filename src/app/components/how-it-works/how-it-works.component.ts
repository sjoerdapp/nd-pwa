import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { SEOService } from 'src/app/services/seo.service';
import { ActivatedRoute } from '@angular/router';
import { isNullOrUndefined } from 'util';

declare const gtag: any;

@Component({
    selector: 'app-how-it-works',
    templateUrl: './how-it-works.component.html',
    styleUrls: ['./how-it-works.component.scss']
})
export class HowItWorksComponent implements OnInit {

    constructor(
        private title: Title,
        private seo: SEOService,
        private route: ActivatedRoute
    ) { }

    ngOnInit() {
        this.title.setTitle(`How It Works | NXTDROP: Buy and Sell Sneakers in Canada`);
        this.seo.addTags('How It Works');

        if (!isNullOrUndefined(this.route.snapshot.queryParams.source)) {
            gtag('event', 'referral_link', {
                'event_category': 'engagement',
                'event_label': 'sms_referral'
            });
        }
    }

}