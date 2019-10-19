import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SlackService {

  constructor(
    private http: HttpClient
  ) { }

  async sendAlert(channel: string, msg: string) {
    switch (channel) {
      case 'offers': {
        const endpoint = 'https://hooks.slack.com/services/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';
        const payload = { "text": msg };

        this.http.post(endpoint, JSON.stringify(payload)).subscribe(res => {
          //console.log(res);
        });
        break;
      }
      case 'listings': {
        const endpoint = 'https://hooks.slack.com/services/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';

        const payload = { "text": msg };

        this.http.post(endpoint, JSON.stringify(payload)).subscribe(res => {
          //console.log(res);
        });
        break;
      }
      case 'others': {
        const endpoint = 'https://hooks.slack.com/services/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';

        const payload = { "text": msg };

        this.http.post(endpoint, JSON.stringify(payload)).subscribe(res => {
          //console.log(res);
        });
        break;
      }
      case 'sales': {
        const endpoint = 'https://hooks.slack.com/services/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';

        const payload = { "text": msg };

        this.http.post(endpoint, JSON.stringify(payload)).subscribe(res => {
          //console.log(res);
        });
        break;
      }
      case 'requests': {
        const endpoint = 'https://hooks.slack.com/services/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';

        const payload = { "text": msg };

        return this.http.post(endpoint, JSON.stringify(payload)).subscribe((res: any) => {
          if (res.status === 200) {
            return true;
          }

          return false;
        });
      }
    }
  }

}
