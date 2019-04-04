import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStoreService } from './local-store.service';
import { UrlJSON } from '../views/json/urlJSON';
import { HttpClient, HttpClientModule, HttpClientXsrfModule, HttpHeaders, HttpResponse} from '@angular/common/http';
import {  Headers, RequestOptions, Response, URLSearchParams } from '@angular/http';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _registerUrl = UrlJSON.registerUrl;
  private _loginUrl = UrlJSON.loginUrl;
  private _forgotUrl = UrlJSON.forgotUrl;
  private _resetUrl = UrlJSON.resetUrl;
  private _validCaptchaUrl = UrlJSON.validCaptchaUrl;
  authenticated = false;
  role = 0;
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  options = {  withCredentials: true };
  constructor( private store: LocalStoreService, private http: HttpClient, private _router: Router) {
    this.checkAuth();
   }
  checkAuth() {
    this.authenticated = this.store.getItem('login_status');
  }
  setStorageItem(crendentials, flag) {
    this.store.setItem(crendentials, flag);
  }
  registerUser(user) {
    return  this.http.post<any>(this._registerUrl, user);
  }
  getCaptcha(catchaToken) {
    return this.http.get<any>(`${this._validCaptchaUrl}/${catchaToken}`);
  }
  loginUser(user) {
    return this.http.post<any>(this._loginUrl, user);
  }
  loggedIn() {
    return !!localStorage.getItem('token');
  }
  forgot(email) {
    return  this.http.post<any>(this._forgotUrl, email);
  }
  reset(data) {
    return  this.http.post<any>(this._resetUrl, data);
  }
  getToken() {
    return localStorage.getItem('token');
  }

  signout() {
    this.authenticated = false;
    localStorage.clear();
    this.store.setItem('login_status', false);
    this.deleteAllCookies();
    this._router.navigateByUrl('/auth/signin');
  }
   deleteAllCookies() {
    const cookies = document.cookie.split(';');

    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i];
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
  }
  setRole(role) {
    this.role = role;
  }
}
