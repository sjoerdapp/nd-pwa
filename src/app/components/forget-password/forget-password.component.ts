import { Component, OnInit } from '@angular/core';
import { EmailService } from 'src/app/services/email.service';
import { Title } from '@angular/platform-browser';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-forget-password',
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.scss']
})
export class ForgetPasswordComponent implements OnInit {

  validEmail = false;
  loading = false;
  error = false;
  sent = false;

  constructor(
    private title: Title,
    private emailService: EmailService,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.title.setTitle(`Forgot Password | NXTDROP: Buy and Sell Sneakers in Canada`);
    this.seo.addTags('Forgot Password');
  }

  sendLink() {
    const email = (document.getElementById('inputEmail') as HTMLInputElement).value;
    this.loading = true;
    if (this.validEmail) {
      this.emailService.sendResetLink(email).then(res => {
        res.subscribe(data => {
          this.loading = false;
          if (data) {
            this.sent = true;
          } else {
            this.error = true;
          }
  
          setTimeout(() => {
            this.error = false;
            this.sent = false;
          }, 10000);
        });
      });
    }
  }

  verifyEmail() {
    const email = (document.getElementById('inputEmail') as HTMLInputElement).value;
    const pattern = new RegExp('^.+@.+[.][a-zA-Z]+$');

    if (pattern.test(email)) {
      this.validEmail = true;
    } else {
      this.validEmail = false;
    }
  }

}
