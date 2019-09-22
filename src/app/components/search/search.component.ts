import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as algoliasearch from 'algoliasearch';
import { environment } from 'src/environments/environment';
import { element } from 'protractor';
import { Title } from '@angular/platform-browser';

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
    private title: Title
  ) { }

  ngOnInit() {
    this.title.setTitle(`Search | NXTDROP: Sell and Buy Sneakers in Canada`);
    const element = document.getElementById('search-input');
    element.focus();
    this.activatedRoute.queryParams.subscribe(data => {
      this.queryParam = data.q;
      (element as HTMLInputElement).value = this.queryParam;
    });
    this.index = this.algoliaClient.initIndex('prod_PRODUCTS');
    this.index.search({
      query: this.queryParam
    }, (err, hits = {}) => {
      if (err) throw err;

      this.results = hits.hits;
      console.log(hits);
    });
  }

  search(event) {
    console.log(event.target.value);

    this.router.navigate([],
      {
        queryParams: { q: event.target.value }
      });

    this.index.search({
      query: event.target.value
    }, (err, hits = {}) => {
      if (err) throw err;

      this.results = hits.hits;
      console.log(hits);
    });
  }

}
