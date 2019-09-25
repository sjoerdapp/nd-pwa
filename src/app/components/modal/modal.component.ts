import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  isOpen = true;
  productInfo;

  constructor(
    private router: Router,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.modalService.change.subscribe(info => {
      this.productInfo = info;
    });
  }

  close() {
    if (this.isOpen) {
      document.getElementById('modal').style.top = '100%';
    }
  }

  open() {
    const element = document.getElementById('modal');
    element.style.height = '100vh';
    // console.log(this.productInfo);
  }

}
