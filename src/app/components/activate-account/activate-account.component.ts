import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as firebase from 'firebase/app';
import { AngularFirestore } from '@angular/fire/firestore';

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
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.code = this.route.snapshot.queryParams.code; 

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
