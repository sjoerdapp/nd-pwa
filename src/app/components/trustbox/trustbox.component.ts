import { Component, OnInit } from '@angular/core';

declare global {
  interface Window { Trustpilot: any; }
}

window.Trustpilot = window.Trustpilot || {};

@Component({
  selector: 'app-trustbox',
  templateUrl: './trustbox.component.html',
  styleUrls: ['./trustbox.component.scss']
})
export class TrustboxComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    const trustboxRef = document.getElementById('trustbox');
    window.Trustpilot.loadFromElement(trustboxRef);
  }

}
