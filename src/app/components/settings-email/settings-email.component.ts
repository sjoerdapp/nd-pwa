import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { isNullOrUndefined } from 'util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings-email',
  templateUrl: './settings-email.component.html',
  styleUrls: ['./settings-email.component.scss']
})
export class SettingsEmailComponent implements OnInit {

  loading: boolean = false
  error: boolean = false
  updated: boolean = false

  new_email_valid: boolean = false
  old_email_valid: boolean = false
  pwd_entered: boolean = false

  user: firebase.User

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.isConnected().then(res => {
      if (isNullOrUndefined(res)) {
        this.router.navigate(['/login'], {
          queryParams: {
            redirectTo: 'settings/email'
          }
        })
      } else {
        this.user = res
      }
    })
  }

  newEmailChanges(event) {
    const email = (document.getElementById('new_email') as HTMLInputElement).value
    const regex = new RegExp(/.+@.+\.[a-zA-Z]{2,}/g)

    if (regex.test(email)) {
      this.new_email_valid = true
    } else {
      this.new_email_valid = false
    }
  }

  oldEmailChanges(event) {
    const email = (document.getElementById('old_email') as HTMLInputElement).value
    const regex = new RegExp(/.+@.+\.[a-zA-Z]{2,}/g)

    if (regex.test(email)) {
      this.old_email_valid = true
    } else {
      this.old_email_valid = false
    }
  }

  pwdChanges(event) {
    const pwd = (document.getElementById('pwd') as HTMLInputElement).value

    if (pwd === '') {
      this.pwd_entered = false
    } else {
      this.pwd_entered = true
    }
  }

  updateEmail() {
    this.loading = true
    const old_email = (document.getElementById('old_email') as HTMLInputElement).value
    const new_email = (document.getElementById('new_email') as HTMLInputElement).value
    const pwd = (document.getElementById('pwd') as HTMLInputElement).value

    this.auth.updateEmail(old_email, new_email, pwd, this.user).then(res => {
      this.loading = false
      if (res) {
        this.updated = true
      } else {
        this.error = true
      }
    }).catch(err => {
      console.error(err)
      this.error = true
    })

    setTimeout(() => {
      this.error = false
      this.updated = false
    }, 2000)
  }

}
