import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SlackService } from 'src/app/services/slack.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  loading = false;
  error = false;
  sent = false;

  constructor(
    private title: Title,
    private auth: AuthService,
    private router: Router,
    private slack: SlackService
  ) { }

  ngOnInit() {
    this.title.setTitle(`Request Product | NXTDROP: Sell and Buy Sneakers in Canada`);

    this.auth.isConnected().then(res => {
      if (!res) {
        this.router.navigate(['login']);
      }
    });
  }

  sendRequest() {
    this.loading = true;
    const products = (document.getElementById('input-request') as HTMLInputElement).value;

    if (products) {
      this.slack.sendAlert('requests', products).then(res => {
        console.log(res);
        this.loading = false;
        this.sent = true;
      }).catch(err => {
        console.error(err);
        this.loading = false;
        this.error = true;
      });
    } else {
      this.loading = false;
    }

    setTimeout(() => {
      this.loading = false;
      this.error = false;
      this.sent = false;
    }, 2000);
  }

}
