import { Component, OnInit } from '@angular/core';
import { NotificationsComponent } from '../notifications/notifications.component';
import { AuthService } from '../../services/auth.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { isNull, isNullOrUndefined } from 'util';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  providers: [NotificationsComponent],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  connected: boolean;

  userInfo = {};

  constructor(
    private notification: NotificationsComponent,
    private auth: AuthService,
    private navbarService: NavbarService,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.auth.checkStatus().then(value => {
      this.checkUser().then(res => {
        if (res) {
          this.connected = value;
        } else {
          this.connected = false
        }
      })
    });

    this.navbarService.getCartItems().then(res => {
      res.subscribe(data => {
        if (!isNull(data)) {
          this.userInfo = data;
        }
      });
    });
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
}
