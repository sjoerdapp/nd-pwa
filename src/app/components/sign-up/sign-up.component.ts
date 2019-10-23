import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { debounceTime, take, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { isUndefined } from 'util';
import { SEOService } from 'src/app/services/seo.service';

export class CustomValidators {

  static username(auth: AuthService) {
    return (control: AbstractControl) => {
      return auth.checkUsername(control.value.toLowerCase()).valueChanges().pipe(
        debounceTime(500),
        take(1),
        map(arr => arr.length ? { usernameAvailable: false } : null)
      );
    };
  }

  static email(auth: AuthService) {
    return (control: AbstractControl) => {
      return auth.checkEmail(control.value).valueChanges().pipe(
        debounceTime(500),
        take(1),
        map(arr => arr.length ? { emailAvailable: false } : null)
      );
    };
  }

}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent implements OnInit {

  signupForm: FormGroup;

  inviteCode: string;

  loading = false;
  error = false;

  constructor(
    public auth: AuthService,
    private fb: FormBuilder,
    private title: Title,
    private route: ActivatedRoute,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.title.setTitle(`Sign Up | NXTDROP: Sell and Buy Sneakers in Canada`);
    this.seo.addTags('Sign Up');

    this.signupForm = this.fb.group({
      firstName: ['', [
        Validators.required,
      ]],
      lastName: ['', [
        Validators.required
      ]],
      username: ['',
        [Validators.minLength(2),
        Validators.required],
        [CustomValidators.username(this.auth)]
      ],
      email: ['',
        [Validators.required,
        Validators.email],
        [CustomValidators.email(this.auth)]
      ],
      password: ['', [
        Validators.minLength(6),
        Validators.maxLength(25)
      ]]
    });

    if (!isUndefined(this.route.snapshot.queryParams.inviteCode)) {
      this.inviteCode = this.route.snapshot.queryParams.inviteCode;
    }
  }

  public signup() {
    this.loading = true;
    console.log('signup called');

    if (isUndefined(this.inviteCode)) {
      return this.auth.emailSignUp(this.email.value, this.password.value, this.firstName.value, this.lastName.value, this.username.value).then(res => {
        if (!res) {
          this.loading = false;
          this.error = true;
          setTimeout(() => {
            this.error = false;
          }, 2500);
        }
      });
    } else {
      return this.auth.emailSignUp(this.email.value, this.password.value, this.firstName.value, this.lastName.value, this.username.value, this.inviteCode).then(res => {
        if (!res) {
          this.loading = false;
          this.error = true;
          setTimeout(() => {
            this.error = false;
          }, 2500);
        }
      });
    }
  }

  // Getters
  get firstName() {
    return this.signupForm.get('firstName');
  }

  get lastName() {
    return this.signupForm.get('lastName');
  }

  get username() {
    return this.signupForm.get('username');
  }

  get email() {
    return this.signupForm.get('email');
  }

  get password() {
    return this.signupForm.get('password');
  }

}
