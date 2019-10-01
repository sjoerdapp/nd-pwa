import { Component, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { SlackService } from 'src/app/services/slack.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  isOpen = true;
  productInfo;
  isFreeShipping = false;
  isMakeOffer = false;
  validEmail = false;
  loading = false;
  sent = false;
  error = false;

  constructor(
    private modalService: ModalService,
    private slack: SlackService,
    private auth: AuthService
  ) { }

  ngOnInit() {
    this.modalService.product.subscribe(info => {
      this.productInfo = info;
    });

    this.modalService.open.subscribe(res => {
      if (res === 'freeShipping') {
        this.isFreeShipping = true;
        const element = document.getElementById('modal');
        element.style.height = '100vh';
        // console.log(this.isFreeShipping);
      } else if (res === 'makeOffer') {
        this.isMakeOffer = true;
        const element = document.getElementById('modal');
        element.style.height = '100vh';
      } else {
        this.close();
      }
    })
  }

  close() {
    if (this.isOpen) {
      document.getElementById('modal').style.top = '100%';
    }
  }

  open() {
    const element = document.getElementById('modal');
    element.style.height = '100vh';
  }

  emailChanges($event) {
    const email = $event.target.value;
    const pattern = new RegExp(/^.+@.+\.[a-zA-Z]{2,}$/gm);

    if (pattern.test(email)) {
      this.validEmail = true;
    } else {
      this.validEmail = false;
    }
  }

  sendInvite() {
    if (this.validEmail) {
      this.loading = true;
      const email = (document.getElementById('input-email') as HTMLInputElement).value;
      this.modalService.sendInviteEmail(email).then(res => {
        res.subscribe(data => {
          this.loading = false;
          if (data) {
            this.sent = true;

            this.auth.isConnected().then(res => {
              this.slack.sendAlert('others', `${res.email} send an invitation to ${email}`);
            });

            setTimeout(() => {
              this.modalService.closeModal();
            }, 2000);
          } else {
            this.error = true;

            setTimeout(() => {
              this.error = false;
            }, 1500)
          }
        })
      })
    }
  }

}
