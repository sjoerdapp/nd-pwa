import { Component, OnInit } from '@angular/core';
import { isUndefined } from 'util';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-settings-buying',
  templateUrl: './settings-buying.component.html',
  styleUrls: ['./settings-buying.component.scss']
})
export class SettingsBuyingComponent implements OnInit {

  redirectURI: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    this.redirectURI = this.route.snapshot.queryParams.redirectURI;
  }

  backBtn() {
    if (isUndefined(this.redirectURI)) {
      this.router.navigate(['..']);
    } else {
      this.router.navigate([`../../${this.redirectURI}`]);
    }
  }

}
