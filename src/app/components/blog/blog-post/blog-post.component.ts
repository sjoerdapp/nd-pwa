import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NewsService } from 'src/app/services/news.service';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BlogPostComponent implements OnInit {

  post: any = {}
  articles = [];

  constructor(
    private route: ActivatedRoute,
    private news: NewsService,
    private title: Title,
    private meta: Meta
  ) { }

  ngOnInit() {
    this.getPost();
  }

  getPost() {
    this.news.getNews(this.route.snapshot.url[1].path).subscribe((json: any) => {
      json = json[0];

      let post: any = {
        title: json.title.rendered,
        date: json.date_gmt,
        id: json.id,
        content: json.content.rendered.replace(/http:\/\/104.197.231.19/g, 'https://news.nxtdrop.com'),
        slug: json.slug,
        excerpt: json.excerpt.rendered,
        category_id: json.categories[0]
      }

      this.news.dateFormat(json.date_gmt);

      this.news.getFeaturedMedia(json._links["wp:featuredmedia"][0]["href"].replace(/http:\/\/104.197.231.19/g, 'https://news.nxtdrop.com')).subscribe((response: any) => {
        post.img = response.source_url.replace(/https:\/\/104.197.231.19/g, 'https://news.nxtdrop.com');
        post.alt_text = response.alt_text;
      });

      this.news.getCategory(json._links["wp:term"][0]["href"].replace(/http:\/\/104.197.231.19/g, 'https://news.nxtdrop.com')).subscribe((response: any) => {
        post.category = response[0].name;
      });

      // this.post.tags = this.news.getTags(json.tags);

      this.post = post;
      this.getRelatedNews(this.post.id, this.post.category_id);

      this.news.getTags(json.tags).then(res => {
        setTimeout(() => {
          this.title.setTitle(`${this.post.title} | NXTDROP: Sneaker and Fashion News`);

          this.meta.addTags([
            { name: `title`, content: `${this.post.title} | NXTDROP: Buy and Sell Authentic Sneakers - Sneaker and Fashion News` },
            { name: `description`, content: `${this.post.excerpt}` },
            { name: `keywords`, content: `stockx, goat, sneakers canada, buy and sell, nike, adidas, air jordan, ${this.displayTags(res)}` },
            { name: `og:title`, content: `${this.post.title} | NXTDROP: Buy and Sell Authentic Sneakers - Sneaker and Fashion News` },
            { name: `og:url`, content: `https://nxtdrop.com/news/${this.post.slug}` },
            { name: `og:image`, content: `${this.post.img}` },
            { name: `og:description`, content: `${this.post.excerpt}` },
            { name: `twitter:title`, content: `${this.post.title} | NXTDROP: Buy and Sell Authentic Sneakers - Sneaker and Fashion News` },
            { name: `twitter:card`, content: 'summary_large_image' },
            { name: `twitter:image`, content: `${this.post.img}` },
            { name: `twitter:description`, content: `${this.post.excerpt}` }
          ]);
        }, 1000);
      }).catch(err => {
        console.error(err);
      });
    });
  }

  getRelatedNews(id: number, categoryID: number) {
    this.news.getRelatedArticles(id, categoryID).subscribe((res: any) => {
      res.forEach(element => {
        let article: any = {
          title: element.title.rendered,
          date: this.news.dateFormat(element.date_gmt),
          id: element.id,
          slug: element.slug
        }

        this.news.getFeaturedMedia(element._links["wp:featuredmedia"][0]["href"].replace(/http:\/\/104.197.231.19/g, 'https://news.nxtdrop.com')).subscribe((response: any) => {
          article.img = response.source_url.replace(/https:\/\/104.197.231.19/g, 'https://news.nxtdrop.com');
          article.alt_text = response.alt_text;
        });

        this.news.getCategory(element._links["wp:term"][0]["href"].replace(/http:\/\/104.197.231.19/g, 'https://news.nxtdrop.com')).subscribe((response: any) => {
          article.category = response[0].name;
        });

        this.articles.push(article);
      });
    })
  }

  displayTags(tags) {
    let tag: string = '';

    for (let i = 0; i < tags.length; i++) {
      if (i == 0) tag += tags[i] + ', ';
      else if (i == tags.length - 1) tag += tags[i]
      else tag += tags[i] + ', '
    }

    //console.log(tag);
    return tag;
  }

}
