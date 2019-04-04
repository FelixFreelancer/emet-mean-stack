import { Component, OnInit } from '@angular/core';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { ItemService } from 'src/app/shared/services/item.service';
import { jsonpCallbackContext } from '@angular/common/http/src/module';
import { Router } from '@angular/router';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings  } from 'angular-2-dropdown-multiselect';
import { countryJSON } from '../../json/countryJSON';
import { activityJSON } from '../../json/activityJSON';
import { typeJSON } from '../../json/typeJSON';
import { interestJSON } from '../../json/interestJSON';
import { UrlJSON } from '../../json/urlJSON';

@Component({
  selector: 'app-list-pagination',
  templateUrl: './item-list.component.html',
  styleUrls: ['./item-list.component.scss'],
  animations: [SharedAnimations]
})
export class ItemListComponent implements OnInit {
  viewMode: 'list' | 'grid' = 'grid';
  allSelected: boolean;
  page = 1;
  pageSize = 8;

  pages = 1;
  current = 1;
  index = 0;
  last_index = 0;
  index_arr = [];

  role = '0';
  items: any[] = [];
  filteredItems: any[] = [];
  checkMode: Boolean = true ;
  searchItemData = {type: 'All', interest: 'All', activity: 'All', geoCountry: 'All', fromAmount: 0, toAmount: 0};
  searchData = {type: 'All', interest: 'All', activity: 'All', geoCountry: 'All', fromAmount: 0, toAmount: 0, send_user_id: ''};

  typeIcon = {'Investor': 'i-Business-Man', 'Company': 'i-Network', 'Entrepreneur': 'i-Business-ManWoman'};
  activityIcon = {'Cars': 'i-Car-3', 'Hi-Tech': 'i-Atom', 'Agricalture': 'i-Tractor', 'Finance': 'i-Financial'};
  interestIcon = {'To Invest': 'i-Coin', 'To Be Sold': 'i-Medal-3', 'Merge': 'i-Handshake', 'Investment': 'i-Coins', 'Buying': 'i-Paypal'};

  countryArr = countryJSON;
  activityArr = activityJSON;
  interestArr = [...interestJSON];
  typeArr = [...typeJSON];

  activityModel: number[];
  activityOptions: IMultiSelectOption[];
  activityWarn = false;
  countryModel: number[];
  countryOptions: IMultiSelectOption[];
  countryWarn = false;
  interestModel: number[];
  interestOptions: IMultiSelectOption[];
  interestWarn = false;

  activitySettings: IMultiSelectSettings = {
    showUncheckAll: true,
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block  btn-after',
    dynamicTitleMaxItems: 1,
    displayAllSelectedText: true,
    containerClasses: 'custom-dropdown',
    closeOnSelect: false
  };
  // Text configuration
  activityTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Clear',
    checked: 'item selected',
    checkedPlural: 'selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'All',
    allSelected: 'All selected',
  };

  interestTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Clear',
    checked: 'interest selected',
    checkedPlural: 'selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'All',
    allSelected: 'All selected',
  };
  countrySettings: IMultiSelectSettings = {
    showUncheckAll: true,
    enableSearch: true,
    checkedStyle: 'fontawesome',
    buttonClasses: 'btn btn-default btn-block  btn-after',
    dynamicTitleMaxItems: 1,
    displayAllSelectedText: true,
    containerClasses: 'custom-dropdown',
    closeOnSelect: false
  };
  // Text configuration
  countryTexts: IMultiSelectTexts = {
    checkAll: 'Select all',
    uncheckAll: 'Clear',
    checked: 'item selected',
    checkedPlural: 'selected',
    searchPlaceholder: 'Find',
    searchEmptyResult: 'Nothing found...',
    searchNoRenderText: 'Type in search box to see results...',
    defaultTitle: 'All',
    allSelected: 'All selected',
  };
  constructor(
    private itemService: ItemService, public router: Router
  ) { }

  ngOnInit() {
    localStorage.setItem('userPage', '1');
    this.typeArr.unshift({id: 0, name: 'All'});
    // this.interestArr.unshift({id: 0, name: 'All'});
    this.fetchItems();
    this.activityOptions = this.activityArr;
    this.countryOptions = this.countryArr;
    this.interestOptions = this.interestArr;
    this.searchItemData.type = this.typeArr[0].name;
    // this.searchItemData.interest = this.interestArr[0].name;
    this.role = localStorage.getItem('role');
    // this.searchItemData.activity = this.activityArr[0].value;
    // this.searchItemData.geoCountry = this.countryArr[0].value;
  }

  fetchItems() {
    this.searchData.activity = this.searchItemData.activity;
    this.searchData.interest = this.searchItemData.interest;
    this.searchData.type = this.searchItemData.type;
    this.searchData.geoCountry = this.searchItemData.geoCountry;
    this.searchData.fromAmount = this.searchItemData.fromAmount;
    this.searchData.toAmount = this.searchItemData.toAmount;
    if (this.searchItemData.activity === '') {
      // this.searchData.activity = this.jsonToString(this.activityArr);
      this.searchData.activity = 'All';
    }
    if (this.searchItemData.interest === '') {
      this.searchData.interest = 'All';
    }
    if (this.searchItemData.type === '') {
      this.searchData.type = 'All';
    }
    if (this.searchItemData.geoCountry === '') {
      this.searchData.geoCountry = 'All';
    }
    if (this.searchItemData.fromAmount == null) {
     this.searchData.fromAmount = 0;
   }
    if (this.searchItemData.toAmount === 0 || this.searchItemData.toAmount == null
       || this.searchItemData.toAmount < this.searchItemData.fromAmount) {
      this.searchData.toAmount = 10000000000;
    }
    this.page = this.getCurrentPage() === null ? 1 : Number(this.getCurrentPage());
    this.itemService.getItems(this.page, this.searchData)
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
  selectAll(e) {
    this.items = this.items.map(p => {
      p.isSelected = this.allSelected;
      return p;
    });

    if (this.allSelected) {

    }
  }

  jsonToString(arr) {
    let return_val = '';
    for (let i = 0; i < arr.length; i++) {
      return_val += arr[i].name + ',';
    }
    return return_val;
  }
  editItem(id) {
    if (this.checkMode) {
      this.router.navigate([`/item/display/${id}`]);
    } else {
      this.router.navigate([`/item/edit/${id}`]);
    }
  }

  editItemDirectly(id) {
    this.router.navigate([`/item/edit/${id}`]);
  }

  getCurrentPage() {
    return localStorage.getItem('itemPage');
  }
  saveCurrentPage(page) {
    localStorage.setItem('itemPage', page);
  }

  gotoPage(page) {
    if (page < 1 || page > this.pages) {
      return;
    }
    this.page = page;
    this.saveCurrentPage( this.page);
    this.fetchItems();
  }
  gotoPreviousPage() {
    if (Number(this.current) - 1 === 0) {
      return;
    } else {
      this.page = Number(this.current) - 1;
      this.saveCurrentPage( this.page);
      this.fetchItems();
    }
  }
  gotoNextPage() {
    if (Number(this.current) + 1 > this.pages) {
      return;
    } else {
      this.page = Number(this.current) + 1;
      this.saveCurrentPage( this.page);
      this.fetchItems();
    }
  }
  pageChange(event) {
    // this.page = event;
    // console.log(event);
  }
  delete() {
    const delete_id = [];
    this.items = this.items.map(p => {
      if (p.isSelected) {
        delete_id.push(p._id);
      }
      return p;
    });
    const delete_ids = JSON.stringify(delete_id);
    this.itemService.removeItems(delete_ids).subscribe(() => {
      this.fetchItems();
    });
  }
  changeItemMode(event, checkMode) {
    this.searchData.send_user_id = '';
    this.page = 1;
    if (!this.checkMode) {
      this.searchData.send_user_id = localStorage.getItem('userId');
    }
    this.fetchItems();
  }
  onChangeActivity(event) {
    this.searchItemData.activity = '';
    for (let i = 0; i < event.length; i++) {
      this.searchItemData.activity += this.activityArr[event[i] - 1].name + ',';
    }
    this.filterData();
  }

  onChangeInterest(event) {
    this.searchItemData.interest = '';
    for (let i = 0; i < event.length; i++) {
      this.searchItemData.interest += this.interestArr[event[i] - 1].name + ',';
    }
    this.filterData();
  }

  onChangeCountry(event) {
    this.searchItemData.geoCountry = '';
    for (let i = 0; i < event.length; i++) {
      this.searchItemData.geoCountry += this.countryArr[event[i] - 1].name + ',';
    }
    this.filterData();
  }
  filterData() {
    this.page = 1;
    this.saveCurrentPage('1');
    this.fetchItems();
    return;
    const search_condition = {type: 'All', interest: 'All', activity: 'All', geoCountry: 'All', fromAmount: 0, toAmount: 0};
    search_condition.type = this.searchItemData.type ? this.searchItemData.type : 'All';
    search_condition.interest = this.searchItemData.interest ? this.searchItemData.interest : 'All';
    search_condition.activity = this.searchItemData.activity !== '' ? this.searchItemData.activity : 'All';
    search_condition.geoCountry = this.searchItemData.geoCountry !== '' ? this.searchItemData.geoCountry : 'All';
    search_condition.fromAmount = this.searchItemData.fromAmount ? this.searchItemData.fromAmount : 0;
    search_condition.toAmount = this.searchItemData.toAmount ? this.searchItemData.toAmount : 0;

    const columns = Object.keys(this.items[0]);
    if (!columns.length) {
      return;
    }
    const search_columns = Object.keys(this.searchItemData);
    const user_id = localStorage.getItem('userId');
    const checkMode = this.checkMode;
    const rows = this.items.filter(function(d) {
      let index = 0;
      if (!checkMode) {
        if ( d['user_id'] !== user_id ) {
          return false;
        }
      }
      for (let i = 0; i < search_columns.length; i++) {
        const search_item = search_columns[i];
        const search_value = search_condition[search_item];
        if (search_item === 'fromAmount' || search_item === 'toAmount') {
            if (search_item === 'fromAmount' && ( d[search_item] >= search_value || search_value === 0 )) {
              index++;
            }
            if (search_item === 'toAmount' && ( d[search_item] <= search_value || search_value === 0 )) {
              index++;
            }
        } else {
          if (search_value === 'All' || search_value.indexOf(d[search_item]) !== -1) {
            index++;
          }
        }
      }
      if (index === search_columns.length) {
        return true;
      } else {
        return false;
      }
    });
    this.filteredItems = rows;
  }

}
