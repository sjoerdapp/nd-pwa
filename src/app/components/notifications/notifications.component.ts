import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  public notificationDisplay() {
    // console.log('open');
    const tab = document.getElementById('notification-tab');
    if (tab.style.right === '0vw') {
      // console.log('close');
      tab.style.right = '-100vw';
    } else {
      // console.log('open');
      tab.style.right = '0vw';
    }
  }
}
