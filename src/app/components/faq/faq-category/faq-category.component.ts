import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-faq-category',
  templateUrl: './faq-category.component.html',
  styleUrls: ['./faq-category.component.scss']
})
export class FaqCategoryComponent implements OnInit {

  category: string = '';
  posts = [];

  constructor(
    private route: ActivatedRoute,
    private afs: AngularFirestore
  ) { }

  ngOnInit() {
    this.category = this.route.snapshot.params.category;

    this.afs.collection(`faq`).ref.where(`categories.${this.category}`, '==', true).limit(10).get().then(res => {
      res.docs.forEach(ele => {
        this.posts.push(ele.data());
      })
    });
  }

}
