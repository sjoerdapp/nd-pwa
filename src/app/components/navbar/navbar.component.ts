import { Component, OnInit } from '@angular/core';
import { NotificationsComponent } from '../notifications/notifications.component';
import { AuthService } from '../../services/auth.service';

@Component({
  providers: [NotificationsComponent],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  connected: boolean;

  constructor(
    private notification: NotificationsComponent,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.connected = this.auth.isConnected();
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
