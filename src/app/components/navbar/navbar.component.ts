import { Component, OnInit, NgZone } from '@angular/core';
import { NotificationsComponent } from '../notifications/notifications.component';
import { AuthService } from '../../services/auth.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { isNullOrUndefined } from 'util';
import { AngularFirestore } from '@angular/fire/firestore';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  providers: [NotificationsComponent],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  connected: boolean;
  showSearchBar: boolean = false;

  typingTimer;
  doneTypingInterval = 1000;

  userInfo = {};

  constructor(
    private notification: NotificationsComponent,
    private auth: AuthService,
    private navbarService: NavbarService,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private router: Router,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    this.auth.checkStatus().then(value => {
      this.checkUser().then(res => {
        if (res) {
          this.connected = value;
        } else {
          this.connected = false;
        }
      })
    });

    const url = this.route.snapshot.url;
    console.log(url)

    if (url.length > 0) {
      if (url[0].path === 'search') {
        this.showSearchBar = false;
      } else {
        this.showSearchBar = true;
      }
    } else {
      this.showSearchBar = false;
    }

    /*this.navbarService.getCartItems().then(res => {
      res.subscribe(data => {
        if (!isNull(data)) {
          this.userInfo = data;
        }
      });
    });*/
  }

  openMenu() {
    // console.log('open');
    const element = document.getElementById('slide-menu');
    element.style.width = '100vw';
  }

  checkUser() {
    return this.auth.isConnected().then(res => {
      if (!isNullOrUndefined(res)) {
        return this.afs.collection(`users`).doc(`${res.uid}`).ref.get().then(docSnapshot => {
          if (!docSnapshot.exists) {
            res.delete();
            return false;
          } else {
            return true;
          }
        });
      }
    })
  }

  public openNotificationTab(): void {
    // console.log('open');
    this.notification.notificationDisplay();
  }

  search(event) {
    clearTimeout(this.typingTimer);
    if (event.target.value) {
      this.typingTimer = setTimeout(() => {
        return this.ngZone.run(() => {
          return this.router.navigate(['../search'], {
            queryParams: { q: event.target.value }
          });
        });
      }, this.doneTypingInterval);
    }
  }
}
