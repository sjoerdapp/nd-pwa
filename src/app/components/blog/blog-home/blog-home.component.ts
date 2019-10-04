import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blog-home',
  templateUrl: './blog-home.component.html',
  styleUrls: ['./blog-home.component.scss']
})
export class BlogHomeComponent implements OnInit {

  posts = [];

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get(`http://104.197.231.19/index.php/wp-json/wp/v2/posts`, {}).subscribe((json: any) => {
      json.forEach(element => {
        this.http.get(element._links["wp:featuredmedia"][0]["href"], {}).subscribe((response: any) => {
          const post = {
            img: response.source_url,
            title: element.title.rendered,
            date: element.date_gmt,
            alt_text: response.caption.alt_text
          }

          this.posts.push(post);
        })
      });
    });

    console.log(this.posts);
  }

}
