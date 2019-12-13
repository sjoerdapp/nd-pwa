import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { SlackService } from 'src/app/services/slack.service';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.scss']
})
export class RequestComponent implements OnInit {

  loading = false;
  error = false;
  sent = false;
  userEmail: string;

  constructor(
    private title: Title,
    private auth: AuthService,
    private router: Router,
    private slack: SlackService,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.title.setTitle(`Request Product | NXTDROP: Sell and Buy Sneakers in Canada`);
    this.seo.addTags('Request Product');

    this.auth.isConnected().then(res => {
      if (!res) {
        this.router.navigate(['login']);
      } else {
        this.userEmail = res.email;
      }
    });
  }

  sendRequest() {
    this.loading = true;
    const products = (document.getElementById('input-request') as HTMLInputElement).value;
    const msg = `${this.userEmail} requested ${products}`;

    if (products) {
      this.slack.sendAlert('requests', msg).then(res => {
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
