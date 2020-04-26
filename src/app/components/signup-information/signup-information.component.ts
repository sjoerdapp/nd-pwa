import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { debounceTime, take, map } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { MetaService } from 'src/app/services/meta.service';
import { isUndefined } from 'util';
import { ActivatedRoute, Router } from '@angular/router';

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
  selector: 'app-signup-information',
  templateUrl: './signup-information.component.html',
  styleUrls: ['./signup-information.component.scss']
})
export class SignupInformationComponent implements OnInit, OnDestroy {

  signupForm: FormGroup;
  accountCreated: boolean;

  loading = false;
  error = false;

  constructor(
    private auth: AuthService,
    private fb: FormBuilder,
    private title: Title,
    private meta: MetaService,
    private ngZone: NgZone,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.title.setTitle(`Sign Up | NXTDROP: Sell and Buy Sneakers in Canada`);
    this.meta.addTags('Sign Up');

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
      password: ['', [
        Validators.minLength(6),
        Validators.maxLength(25)
      ]]
    });

    this.accountCreated = false;
  }

  ngOnDestroy() {
    //console.log(this.accountCreated);
    if (!this.accountCreated) {
      this.auth.isConnected().then(res => {
        res.delete();
      });
    }
  }

  createUser() {
    //console.log('createUser() called');
    this.loading = true;
    const redirect = this.route.snapshot.queryParams.redirectTo;

    this.auth.addInformationUser(this.firstName.value, this.lastName.value, this.username.value, this.password.value).then((res) => {
      if (!res) {
        this.loading = false;
        this.error = true;
      } else {
        this.accountCreated = true;

        if (!isUndefined(redirect)) {
          return this.ngZone.run(() => {
            return this.router.navigateByUrl(`${redirect}`);
          });
        } else {
          return this.ngZone.run(() => {
            return this.router.navigate(['/home']);
          });
        }
      }

      setTimeout(() => {
        this.error = false;
      }, 1000);
      //console.log(this.accountCreated);
    });
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

  get password() {
    return this.signupForm.get('password');
  }

}
