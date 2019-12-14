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

  nbPages: number = 1;
  searchLimit: boolean = false;

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
      this.search();
    }
  }

  search() {
    //console.log(event.target.value);

    const term = (document.getElementById('search-input') as HTMLInputElement).value;

    this.router.navigate([],
      {
        queryParams: { q: term }
      });

    this.index.search({
      query: term,
      attributesToRetrieve: ['assetURL', 'model', 'productID'],
      hitsPerPage: 48 * this.nbPages

    }, (err, hits = {}) => {
      if (err) throw err;

      this.results = hits.hits;

      if (hits.nbPages <= this.nbPages || hits.nbPages === 0) {
        this.searchLimit = true;
      } else {
        this.searchLimit = false
      }

      console.log(this.nbPages);
      console.log(hits);
    });
  }

  moreProducts() {
    this.nbPages++;
    this.search();
  }

}
