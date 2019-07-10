import { Component, OnInit } from '@angular/core';
import { NotificationsComponent } from '../notifications/notifications.component';

@Component({
  providers: [NotificationsComponent],
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  connected = true;

  constructor(
    private notification: NotificationsComponent
  ) { }

  ngOnInit() {
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
