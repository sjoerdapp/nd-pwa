import { Component, OnInit } from '@angular/core';
import { SettingsPasswordService } from 'src/app/services/settings-password.service';

@Component({
  selector: 'app-settings-password',
  templateUrl: './settings-password.component.html',
  styleUrls: ['./settings-password.component.scss']
})
export class SettingsPasswordComponent implements OnInit {

  samePwd = false;
  pwdEntered = false;
  newPwdEntered = false;
  errorPwd = false;

  loading = false;
  error = false;
  updated = false;

  constructor(
    private settingsPasswordService: SettingsPasswordService
  ) { }

  ngOnInit() {
  }

  pwdChanges($event) {
    const pwd = (document.getElementById('new-pwd') as HTMLInputElement).value;
    const confPwd = (document.getElementById('confirm-new-pwd') as HTMLInputElement).value;

    if (pwd == '') {
      this.pwdEntered = false;
    } else {
      this.pwdEntered = true;
    }

    if (pwd != confPwd) {
      this.samePwd = false;
    } else {
      this.samePwd = true;
    }

    if (confPwd == '') {
      this.newPwdEntered = false;
    } else {
      this.newPwdEntered = true;
    }

    // console.log(this.samePwd + ' ' + this.newPwdEntered);

    this.samePwd && this.newPwdEntered ? this.errorPwd = false : this.errorPwd = true;
  }

  confPwdChanges($event) {
    const pwd = (document.getElementById('new-pwd') as HTMLInputElement).value;
    const confPwd = (document.getElementById('confirm-new-pwd') as HTMLInputElement).value;

    if (pwd != confPwd) {
      this.samePwd = false;
    } else {
      this.samePwd = true;
    }

    if (confPwd == '') {
      this.newPwdEntered = false;
    } else {
      this.newPwdEntered = true;
    }

    // console.log(this.samePwd + ' ' + this.newPwdEntered);

    this.samePwd && this.newPwdEntered ? this.errorPwd = false : this.errorPwd = true;
  }

  updatePassword() {
    const oldPwd = (document.getElementById('old-pwd') as HTMLInputElement).value;
    const pwd = (document.getElementById('new-pwd') as HTMLInputElement).value;

    if (this.pwdEntered && this.newPwdEntered) {
      this.loading = true;
      this.settingsPasswordService.updatePassword(oldPwd, pwd).then(res => {
        if (res) {
          this.loading = false;
          this.updated = true;
          this.reset(res);
        } else {
          this.loading = false;
          this.error = true;
          this.reset(res);
        }
      });
    } else {
      return;
    }
  }

  reset(isError) {
    setTimeout(() => {
      this.updated = false;
      this.error = false;
      if (isError) {
        this.newPwdEntered = false;
      this.pwdEntered = false;
      }
    }, 2000);
  }

}
