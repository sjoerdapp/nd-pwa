import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-blog-home',
  templateUrl: './blog-home.component.html',
  styleUrls: ['./blog-home.component.scss']
})
export class BlogHomeComponent implements OnInit {

  posts = [];

  constructor(
    private router: Router,
    private news: NewsService
  ) { }

  ngOnInit() {
    this.news.getAllNews().subscribe((json: any) => {
      json.forEach(element => {
        let post: any = {
          title: element.title.rendered,
          date: this.news.dateFormat(element.date_gmt),
          id: element.id,
          slug: element.slug
        }

        this.news.getFeaturedMedia(element._links["wp:featuredmedia"][0]["href"]).subscribe((response: any) => {
          post.img = response.source_url;
          post.alt_text = response.alt_text;
        });

        this.news.getCategory(element._links["wp:term"][0]["href"]).subscribe((response: any) => {
          post.category = response[0].name;
        });

        this.posts.push(post);
      });
    });
  }

}
