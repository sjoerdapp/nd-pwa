import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  mode: string;
  code: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    this.mode = this.route.snapshot.queryParams.mode;
    this.code = this.route.snapshot.queryParams.oobCode;

    if (this.mode === 'resetPassword') {
      this.router.navigate(['../reset-password'], { queryParams: { code: this.code } });
    } else if (this.mode === 'verifyEmail') {
      this.router.navigate(['../activate-account'], { queryParams: { code: this.code } });
    }
  }

}
