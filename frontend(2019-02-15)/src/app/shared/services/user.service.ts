import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlJSON } from '../../views/json/urlJSON';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _getUserUrl = UrlJSON.getUserUrl;
  private _addUserUrl = UrlJSON.addUserUrl;
  private _getUserByIDUrl = UrlJSON.getUserByIDUrl;
  private _getUserForSearchUrl = UrlJSON.getUserForSearchUrl;
  private _updateUserUrl = UrlJSON.updateUserUrl;
  private _updateUserbyRegularUrl = UrlJSON.updateUserbyRegularUrl;
  private _removeUserUrl = UrlJSON.removeUserUrl;
  private _loadFromLocalToDbUrl = UrlJSON.loadFromLocalToDbUrl;
  private _createDummyDataUrl = UrlJSON.createDummyDataUrl;
  constructor(
    private http: HttpClient
  ) { }

  getUsers(page, searchData) {
    return this.http.post<any>(`${this._getUserUrl}/${page}`, searchData);
  }
  getUsersForSearch(page, searchData) {
    return this.http.post<any>(`${this._getUserForSearchUrl}/${page}`, searchData);
  }
  addUser(user) {
    return this.http.post<any>(this._addUserUrl, user);
  }
  getUserByID(id) {
    return this.http.get<any>(`${this._getUserByIDUrl}/${id}`);
  }
  updateUser(id, user) {
    return this.http.post<any>(`${this._updateUserUrl}/${id}`, user);
  }
  updateUserbyRegular(id, user) {
    return this.http.post<any>(`${this._updateUserbyRegularUrl}/${id}`, user);
  }
  removeUser(id) {
    return this.http.delete<any>(`${this._removeUserUrl}/${id}`);
  }

  loadFromLocalToDb() {
    return this.http.get<any>(this._loadFromLocalToDbUrl);
  }
  createDummyData(userCount, itemCount) {
    return this.http.get<any>(`${this._createDummyDataUrl}/${userCount}/${itemCount}`);
  }
}
