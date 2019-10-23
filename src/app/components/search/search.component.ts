import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as algoliasearch from 'algoliasearch';
import { environment } from 'src/environments/environment';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import { SEOService } from 'src/app/services/seo.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  algoliaClient = algoliasearch(environment.algolia.appId, environment.algolia.apiKey);
  index;

  queryParam: string;

  results;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private title: Title,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private seo: SEOService
  ) { }

  ngOnInit() {
    this.title.setTitle(`Search | NXTDROP: Sell and Buy Authentic Sneakers in Canada`);
    this.seo.addTags('Search');

    if (isPlatformBrowser(this._platformId)) {
      const element = document.getElementById('search-input');
      element.focus();
      this.activatedRoute.queryParams.subscribe(data => {
        this.queryParam = data.q;
        (element as HTMLInputElement).value = this.queryParam;
      });
      this.index = this.algoliaClient.initIndex(environment.algolia.index);
      this.index.search({
        query: this.queryParam
      }, (err, hits = {}) => {
        if (err) throw err;

        this.results = hits.hits;
        //console.log(hits);
      });
    }
  }

  search(event) {
    //console.log(event.target.value);

    this.router.navigate([],
      {
        queryParams: { q: event.target.value }
      });

    this.index.search({
      query: event.target.value
    }, (err, hits = {}) => {
      if (err) throw err;

      this.results = hits.hits;
      //console.log(hits);
    });
  }

}
