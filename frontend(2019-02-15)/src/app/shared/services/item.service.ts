import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UrlJSON } from '../../views/json/urlJSON';
@Injectable({
  providedIn: 'root'
})
export class ItemService {

  private _addItemUrl = UrlJSON.addItemUrl;
  private _getItemsUrl = UrlJSON.getItemsUrl;
  private _getItemsForSearchUrl = UrlJSON.getItemsForSearchUrl;
  private _getItemByIdUrl = UrlJSON.getItemByIdUrl;
  private _getDisplayItemByIdUrl = UrlJSON.getDisplayItemByIdUrl;
  private _removeItemsUrl = UrlJSON.removeItemsUrl;
  private _updateItemUrl = UrlJSON.updateItemUrl;
  constructor(
    private http: HttpClient
  ) { }

  addItem(item) {
    return this.http.post<any>(this._addItemUrl, item);
  }

  getItems(page, searchData) {
    return this.http.post<any>(`${this._getItemsUrl}/${page}`, searchData);
  }

  getItemsForSearch(page, searchData) {
    return this.http.post<any>(`${this._getItemsForSearchUrl}/${page}`, searchData);
  }
  // getItemsForSearch() {
  //   return this.http.get<any>(`${this._getItemsForSearchUrl}`);
  // }

  removeItems(delete_ids) {
    return this.http.delete<any>(`${this._removeItemsUrl}/${delete_ids}`);
  }

  getItemByID(id) {
    return this.http.get<any>(`${this._getItemByIdUrl}/${id}`);
  }

  getDisplayItemByID(id) {
    return this.http.get<any>(`${this._getDisplayItemByIdUrl}/${id}`);
  }

  updateItem(id, item) {
    return this.http.post<any>(`${this._updateItemUrl}/${id}`, item);
  }
}
