import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  public searchOpen: boolean;
  public searchUserOpen: boolean;
  constructor() { }
}
