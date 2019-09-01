import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss']
})
export class CarouselComponent implements OnInit {

  typingTimer;
  doneTypingInterval = 500;
  myInput = document.getElementById('search-field');

  constructor(
    private router: Router,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
  }

  search(event) {
    clearTimeout(this.typingTimer);
    if (event.target.value) {
      this.typingTimer = setTimeout(() => {
        return this.ngZone.run(() => {
          return this.router.navigate(['../search'], {
            queryParams: { q: (document.getElementById('search-field') as HTMLInputElement).value }
          });
        });
      }, this.doneTypingInterval);
    }
  }

}
