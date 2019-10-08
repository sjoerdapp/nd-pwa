import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BlogPostComponent implements OnInit {

  post = {}

  constructor(
    private route: ActivatedRoute,
    private news: NewsService
  ) { }

  ngOnInit() {
    console.log(this.route.snapshot.url[1].path);
    this.news.getNews(this.route.snapshot.url[1].path).subscribe((json: any) => {
      json = json[0];
      let post: any = {
        title: json.title.rendered,
        date: json.date_gmt,
        id: json.id,
        content: json.content.rendered
      }

      this.news.dateFormat(json.date_gmt);

      this.news.getFeaturedMedia(json._links["wp:featuredmedia"][0]["href"]).subscribe((response: any) => {
        post.img = response.source_url;
        post.alt_text = response.alt_text;
      });

      this.news.getCategory(json._links["wp:term"][0]["href"]).subscribe((response: any) => {
        post.category = response[0].name;
      });

      this.post = post;
      console.log(this.post);
    });
  }

}
