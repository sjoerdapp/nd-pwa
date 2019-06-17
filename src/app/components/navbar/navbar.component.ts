import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  connected = false;

  constructor() { }

  ngOnInit() {
  }

  openMenu() {
    // console.log('open');
    const element = document.getElementById('slide-menu');
    element.style.width = '100vw';
  }

  closeMenu() {
    // console.log('work');
    const element = document.getElementById('slide-menu');
    element.style.width = '0vw';
  }

}
