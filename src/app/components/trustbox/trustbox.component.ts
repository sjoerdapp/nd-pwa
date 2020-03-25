import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

declare global {
  interface Window { Trustpilot: any; }
}

@Component({
  selector: 'app-trustbox',
  templateUrl: './trustbox.component.html',
  styleUrls: ['./trustbox.component.scss']
})
export class TrustboxComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private _platformId: Object
  ) { }

  ngOnInit() {
    if (isPlatformBrowser(this._platformId)) {
      window.Trustpilot = window.Trustpilot || {};
      const trustboxRef = document.getElementById('trustbox');
      window.Trustpilot.loadFromElement(trustboxRef);
    }
  }

}
