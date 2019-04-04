import { Component, OnInit } from '@angular/core';
import { DataLayerService } from '../../../services/data-layer.service';
import { Observable, combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap, map } from 'rxjs/operators';
import { SharedAnimations } from '../../../animations/shared-animations';
import { SearchService } from '../../../services/search.service';
import { ItemService } from 'src/app/shared/services/item.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { UrlJSON } from '../../../../views/json/urlJSON';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  animations: [SharedAnimations]
})
export class SearchComponent implements OnInit {
  page = 1;
  pageSize = 6;
  role: String;
  url = UrlJSON;


  pages = 1;
  current = 1;
  index = 0;
  last_index = 0;
  index_arr = [];
  results$: Observable<any[]>;
  items: any[] = [];
  filteredItems: any[] = [];
  searchData = {searchText : ''};
  searchCtrl: FormControl = new FormControl('');

  constructor(
    private dl: DataLayerService,
    public searchService: SearchService,
    private itemService: ItemService,
    private router: Router
  ) { }
  goHome() {
    this.searchService.searchOpen = false;
    this.router.navigate(['/item/list/']);
  }

  editItem(id) {
      this.searchService.searchOpen = false;
      this.router.navigate([`/item/display/${id}`]);
  }
  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.fetchItems();
    // this.results$ = combineLatest(
    //   this.itemService.getItemsForSearch(),
    //   this.searchCtrl.valueChanges
    //   .pipe(startWith(''), debounceTime(200))
    // )
    // .pipe(map(([items, searchTerm]) => {
    //   return items.filter(p => {
    //     return p.type.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
    //            p.geoCountry.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
    //            p.interest.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1 ||
    //            p.activity.toLowerCase().indexOf(searchTerm.toLowerCase()) > -1;
    //   });
    // }));
  }

  jsonToString(arr) {
    let return_val = '';
    for (let i = 0; i < arr.length; i++) {
      return_val += arr[i].name + ',';
    }
    return return_val;
  }

  editItemDirectly(id) {
    this.router.navigate([`/item/edit/${id}`]);
  }

  gotoPage(page) {
    if (page < 1 || page > this.pages) {
      return;
    }
    this.page = page;
    this.fetchItems();
  }
  gotoPreviousPage() {
    if (Number(this.current) - 1 === 0) {
      return;
    } else {
      this.page = Number(this.current) - 1;
      this.fetchItems();
    }
  }
  gotoNextPage() {
    if (Number(this.current) + 1 > this.pages) {
      return;
    } else {
      this.page = Number(this.current) + 1;
      this.fetchItems();
    }
  }
  pageChange(event) {
    // this.page = event;
    // console.log(event);
  }

  fetchItems() {
    this.itemService.getItemsForSearch(this.page, this.searchData)
    .subscribe((val: any[]) => {
      const items = val['item'];
      this.pages = Number(val['pages']);
      this.current = Number(val['current']);
      this.index = Number(this.current) > 3 ? Number(this.current) - 2 : 1;
      this.last_index = this.current + 2;
      this.index_arr = [];
      if (this.current > 3) {
        for (let i = this.current - 1  ; i < (Number(this.current) + 2) && i <= this.pages; i++ ) {
          this.index_arr.push(i);
        }
      } else {
        for (let i = this.index  ; i < (Number(this.current) + 2) && i <= this.pages; i++ ) {
          this.index_arr.push(i);
        }
      }


      this.items = [...items];
      this.filteredItems = items;
      for (let i = 0; i < this.filteredItems.length; i++) {
        if (this.filteredItems[i].picture === 'default.jpg') {
          this.filteredItems[i].picture = '../../../../assets/images/item/default.png';
        } else {
          if (this.filteredItems[i].extraBlob === '2') {
            this.filteredItems[i].picture = UrlJSON.displayPictureFromFSUrl + this.filteredItems[i].picture;
          } else {
            this.filteredItems[i].picture = UrlJSON.displayPictureUrl + this.filteredItems[i].picture;
          }
        }
      }
    });
  }

  fetchData() {
    this.page = 1;
    this.fetchItems();
  }

}
