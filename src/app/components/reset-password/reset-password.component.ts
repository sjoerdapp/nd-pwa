import { Component, OnInit } from '@angular/core';
import { EmailService } from 'src/app/services/email.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  errorPwd = false;

  pwd: string;
  confPwd: string;

  code: string;

  loading = false;
  error = false;
  reset = false;


  constructor(
    private emailService: EmailService,
    private route: ActivatedRoute,
    private router: Router,
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle(`Reset Password | NXTDROP: Sell and Buy Sneakers in Canada`);
    this.code = this.route.snapshot.queryParams.code;
    console.log(this.code);
    this.pwdChanges();
  }

  pwdChanges() {
    this.pwd = (document.getElementById('new-pwd') as HTMLInputElement).value;
    this.confPwd = (document.getElementById('confirm-new-pwd') as HTMLInputElement).value;

    (this.pwd !== this.confPwd && this.confPwd !== '' && this.pwd !== '') || (this.pwd === this.confPwd && this.confPwd === '') ? this.errorPwd = true : this.errorPwd = false;
  }

  resetPassword() {
    const pwd = (document.getElementById('new-pwd') as HTMLInputElement).value;
    const confPwd = (document.getElementById('confirm-new-pwd') as HTMLInputElement).value;

    if (pwd === confPwd && confPwd !== '' && this.code !== '') {
      this.loading = true;
      this.emailService.resetPassword(this.code, confPwd).then(res => {
        this.loading = false;
        if (res) {  
          this.reset = true;
        } else {
          this.error = true;
        }

        setTimeout(() => {
          this.reset = false;
          this.error = false;

          if (res) {
            this.router.navigate(['../login']);
          }
        }, 2000);
      });
    }
  }



}
