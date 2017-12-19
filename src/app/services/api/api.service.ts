import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
  address: string;
  deletesEnabled: boolean = false;
  platformNames: string[] = ['Windows', 'Mac', 'Linux', 'Web', 'Android', 'iOS'];

  constructor(private http: Http) { }

  init() {
    return this.getExternal("http://sleepystudios.net/waker.txt");
  }

  getExternal(url: string) {
    return this.http.get(url)
                    .map(res => res.text());
  }

  get(params: string) {
    return this.http.get(this.address + '/' + params, {withCredentials: true})
                    .map(res => res.json());
  }

  post(params: string, data: any) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(this.address + "/" + params, data, {headers: headers, withCredentials: true})
                    .map(res => res.json());
  }
}
