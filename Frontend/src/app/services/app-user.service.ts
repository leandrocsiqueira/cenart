import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ENVIRONMENT } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class AppUserService {
  url: string = ENVIRONMENT.apiUrl;

  constructor(private _httpClient: HttpClient) {}

  login(data: any) {
    return this._httpClient.post(this.url + '/appuser/login', data, {
      headers: new HttpHeaders().set('Content-Type', 'application/json'),
    });
  }
}
