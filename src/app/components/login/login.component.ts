import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { isUndefined } from 'util';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  loading = false;
  error = false;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private title: Title,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.title.setTitle(`Log In | NXTDROP: Buy and Sell Sneakers in Canada`);
    this.loginForm = this.fb.group({
      email: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]]
    });
  }

  login() {
    this.loading = true;
    // console.log('login() called');

    if (this.email.value || this.password.value) {
      return this.auth.emailLogin(this.email.value, this.password.value).then(res => {
        if (!res) {
          this.showError();
        } else {
          const redirect = this.route.snapshot.queryParams.redirectTo;

          if (!isUndefined(redirect)) {
            const url = decodeURIComponent(redirect);
            console.log(url);
            this.router.navigateByUrl(url);
          } else {
            this.router.navigate(['/home']);
          }
        }
      });
    } else {
      this.showError();
    }
  }

  private showError() {
    this.loading = false;
    this.error = true;
    setTimeout(() => {
      this.error = false;
    }, 2500);
  }

  public facebookSign() {
    this.auth.facebookSignIn();
  }

  public googleSign() {
    this.auth.googleSignIn();
  }

  // GETTER
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

}
