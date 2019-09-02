import { Component, OnInit } from '@angular/core';
import { NotificationsComponent } from '../notifications/notifications.component';
import { AuthService } from '../../services/auth.service';
import { NavbarService } from 'src/app/services/navbar.service';
import { isNull } from 'util';

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
    private navbarService: NavbarService
  ) { }

  ngOnInit() {
    this.auth.checkStatus().then(value => {
      this.connected = value;
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

  public openNotificationTab(): void {
    // console.log('open');
    this.notification.notificationDisplay();
  }
}
