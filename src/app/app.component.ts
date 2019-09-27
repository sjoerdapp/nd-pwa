import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

declare var gtag: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    router: Router,
    auth: AuthService
  ) {
    const navEndEvents = router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    );

    auth.isConnected().then(res => {
      gtag('set', {'user_id': res.uid}); // Set the user ID using signed-in user_id.
    })

    navEndEvents.subscribe((event: NavigationEnd) => {
      gtag('config', 'UA-148418496-1', {
        'page_path': event.urlAfterRedirects
      });
    });
  }

}
