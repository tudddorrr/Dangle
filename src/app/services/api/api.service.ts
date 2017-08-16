import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ApiService {
  address: string = "http://localhost:4040";
  deletesEnabled: boolean = false;

  constructor(private http: Http) { }

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
