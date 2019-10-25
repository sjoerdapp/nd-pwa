import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';
import { Title } from '@angular/platform-browser';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {
  
  code: string;
  error = false;
  good = false;


  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore,
    private title: Title,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.code = this.route.snapshot.queryParams.code;
    this.title.setTitle(`Activate Account | NXTDROP: Sell and Buy Sneakers in Canada`);
    this.seo.addTags('Activate Account');

    this.afs.collection(`users`).doc(`${this.code}`).update({
      isActive: true
    }).then(() => {
      this.good = true;
    }).catch(err => {
      // console.error(err);
      this.error = true;
    });
  }

}
