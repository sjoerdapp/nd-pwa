import { Component, AfterViewInit, PLATFORM_ID, Inject } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';
import { SEOService } from './services/seo.service';
import { isPlatformBrowser } from '@angular/common';

declare const gtag: any;
declare const fbq: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  constructor(
    private router: Router,
    private auth: AuthService,
    private seo: SEOService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {}

  ngAfterViewInit() {
    const navEndEvents = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );

    if (isPlatformBrowser(this._platformId)) {
      this.auth.isConnected().then(res => {
        if (res != undefined) {
          gtag('set', { 'user_id': res.uid }); // Set the user ID using signed-in user_id.
          fbq('init', '247312712881625', { uid: res.uid });
          this.auth.updateLastActivity(res.uid);
        } else {
          fbq('init', '247312712881625');
        }
      }).catch(err => {
        console.error(err);
      })
    }

    navEndEvents.subscribe((event: NavigationEnd) => {
      if (isPlatformBrowser(this._platformId)) {
        (<any>window).gtag('config', 'UA-148418496-1', {
          'page_path': event.urlAfterRedirects
        });
        fbq('track', 'PageView');
      }
      this.seo.createCanonicalLink();
    });
  }

}
