import { Injectable, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  constructor(
    private http: HttpClient
  ) { }

  getAllNews() {
    return this.http.get(`http://104.197.231.19/index.php/wp-json/wp/v2/posts`, {});
  }

  getFeaturedMedia(url: string) {
    return this.http.get(url, {});
  }

  getCategory(url: string) {
    return this.http.get(url, {});
  }

  getNews(id: string) {
    return this.http.get(`http://104.197.231.19/index.php/wp-json/wp/v2/posts?slug=${id}`, {});
  }

  dateFormat(date) {
    const today = Date.now();
    date = date.replace(/-/g, ' ').replace('T', ' ').replace(/:/g, ' ').split(' ');
    date = Date.UTC(date[0], date[1] - 1, date[2], date[3], date[4], date[5]);

    //console.log(`today: ${today}, date: ${date}`);

    if (today - date < 3600000) {
      //console.log(`couple minutes ago`);
      return `couple minutes ago`;
    } else if (today - date < 86400000) {
      const diff = Math.floor((today - date) / 3600000);

      if (diff > 1) {
        //console.log(`${diff} hours ago`);
        return `${diff} hours ago`;
      } else {
        //console.log(`${diff} hour ago`);
        return `${diff} hour ago`;
      }
    } else if (today - date < 604800000) {
      const diff = Math.floor((today - date) / 86400000);

      if (diff > 1) {
        //console.log(`${diff} days ago`);
        return `${diff} days ago`;
      } else {
        //console.log(`${diff} day ago`);
        return `${diff} day ago`;
      }
    } else {
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      //console.log(new Date(date).toLocaleDateString('en-US', options));
      return new Date(date).toLocaleDateString('en-US', options);
    }
  }

}
