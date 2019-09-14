import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import * as firebase from 'firebase/app';

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
    private fb: FormBuilder
  ) { }

  ngOnInit() {
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

  // GETTER
  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

}
