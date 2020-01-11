import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { SEOService } from 'src/app/services/seo.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-activate-account',
  templateUrl: './activate-account.component.html',
  styleUrls: ['./activate-account.component.scss']
})
export class ActivateAccountComponent implements OnInit {
  
  code: string;
  error = false;
  good = false;


  constructor(
    private route: ActivatedRoute,
    private title: Title,
    private seo: SEOService,
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.code = this.route.snapshot.queryParams.code;
    this.title.setTitle(`Activate Account | NXTDROP: Sell and Buy Sneakers in Canada`);
    this.seo.addTags('Activate Account');

    this.http.put(`${environment.cloud.url}activateAccount`, { code: this.code }).subscribe(res => {
      res ? this.good = true : this.error = true;
    });
  }

}
