import { Component, OnInit } from '@angular/core';
import { EmailService } from 'src/app/services/email.service';

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
    private emailService: EmailService
  ) { }

  ngOnInit() {
  }

  sendLink() {
    const email = (document.getElementById('inputEmail') as HTMLInputElement).value;
    this.loading = true;
    if (this.validEmail) {
      this.emailService.sendResetLink(email).then(res => {
        this.loading = false;
        if (res) {
          this.sent = true;
        } else {
          this.error = true;
        }

        setTimeout(() => {
          this.error = false;
          this.sent = false;
        }, 2000);
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
