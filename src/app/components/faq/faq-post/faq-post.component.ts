import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-faq-post',
  templateUrl: './faq-post.component.html',
  styleUrls: ['./faq-post.component.scss']
})
export class FaqPostComponent implements OnInit {

  category: string = '';
  post: string = '';

  content: any = {
    Q: '',
    A: '',
  }

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.category = this.route.snapshot.params.category;
    this.post = this.route.snapshot.params.post;

    this.afs.collection(`faq`).doc(`${this.post}`).valueChanges().subscribe(res => {
      this.content = res;
    });
  }

}
