import { Component, OnInit,  ViewChild, ElementRef } from '@angular/core';
import { DataLayerService } from 'src/app/shared/services/data-layer.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { UserService } from 'src/app/shared/services/user.service';
import { Router } from '@angular/router';
import { IMultiSelectOption, IMultiSelectTexts, IMultiSelectSettings  } from 'angular-2-dropdown-multiselect';
import { countryJSON } from '../../json/countryJSON';
import { UrlJSON } from '../../json/urlJSON';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  animations: [SharedAnimations]
})
export class UserListComponent implements OnInit {
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
  users: any[] = [];
  filteredUsers: any[] = [];
  searchUserData = { country: 'All', fromDate: '', toDate: ''};
  searchData = { country: 'All', fromDate: '', toDate: ''};

  countryArr = countryJSON;

  countryModel: number[];
  countryOptions: IMultiSelectOption[];
  countryWarn = false;

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

  @ViewChild('confirmModal_view') confirmModal_view: ElementRef;
  currentId;
  constructor(
    private userService: UserService, public router: Router, private modalService: NgbModal
  ) { }

  ngOnInit() {
    localStorage.setItem('itemPage', '1');
    this.fetchUsers();
    this.countryOptions = this.countryArr;
    this.role = localStorage.getItem('role');
    // this.searchUserData.activity = this.activityArr[0].value;
    // this.searchUserData.country = this.countryArr[0].value;
  }

  fetchUsers() {
    this.searchData.country = this.searchUserData.country;
    this.searchData.fromDate = this.searchUserData.fromDate;
    this.searchData.toDate = this.searchUserData.toDate;
    if (this.searchUserData.country === '') {
      this.searchData.country = 'All';
    }
    if (this.searchUserData.fromDate == null || this.searchUserData.fromDate === '') {
     this.searchData.fromDate = '1900-01-01';
    } else {
      const fromDateObj = this.searchUserData.fromDate;
      const from_month = fromDateObj['month'] < 9 ?  '0' + fromDateObj['month'] : fromDateObj['month'] ;
      const from_day = fromDateObj['day'] < 9 ?  '0' + fromDateObj['day'] : fromDateObj['day'] ;
      this.searchData.fromDate = fromDateObj['year'] + '-' + from_month + '-' + from_day ;
      const toDateObj = this.searchUserData.toDate;
      const to_month = toDateObj['month'] < 9 ?  '0' + toDateObj['month'] : toDateObj['month'] ;
      const to_day = toDateObj['day'] < 9 ?  '0' + toDateObj['day'] : toDateObj['day'] ;
      this.searchData.toDate = toDateObj['year'] + '-' + to_month + '-' + to_day;
    }
    if (this.searchUserData.toDate === '' || this.searchUserData.toDate == null
       || this.searchUserData.toDate < this.searchUserData.fromDate) {
      this.searchData.toDate = '2100-01-01';
    }
    this.page = this.getCurrentPage() === null ? 1 : Number(this.getCurrentPage());
    this.userService.getUsers(this.page, this.searchData)
    .subscribe((val: any[]) => {
      const users = val['user'];
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

      this.users = [...users];
      this.filteredUsers = users;

      for ( let i = 0; i < this.filteredUsers.length; i++) {
        if (this.filteredUsers[i].picture === 'default.png') {
          this.filteredUsers[i].picture = '../../../../assets/images/avatar/default.png';
        } else {
          if (this.filteredUsers[i].extraBlob === '2') {
            this.filteredUsers[i].picture = UrlJSON.displayAvatarFromFSUrl + this.filteredUsers[i].picture;
          } else {
            this.filteredUsers[i].picture = UrlJSON.displayPictureUrl + this.filteredUsers[i].picture;
          }
        }
      }
    });
  }
  jsonToString(arr) {
    let return_val = '';
    for (let i = 0; i < arr.length; i++) {
      return_val += arr[i].name + ',';
    }
    return return_val;
  }
  getCurrentPage() {
    return localStorage.getItem('userPage');
  }
  saveCurrentPage(page) {
    localStorage.setItem('userPage', page);
  }

  gotoPage(page) {
    if (page < 1 || page > this.pages) {
      return;
    }
    this.page = page;
    this.saveCurrentPage( this.page);
    this.fetchUsers();
  }
  gotoPreviousPage() {
    if (Number(this.current) - 1 === 0) {
      return;
    } else {
      this.page = Number(this.current) - 1;
      this.saveCurrentPage( this.page);
      this.fetchUsers();
    }
  }
  gotoNextPage() {
    if (Number(this.current) + 1 > this.pages) {
      return;
    } else {
      this.page = Number(this.current) + 1;
      this.saveCurrentPage( this.page);
      this.fetchUsers();
    }
  }
  pageChange(event) {
    // this.page = event;
    // console.log(event);
  }


  onChangeCountry(event) {
    this.searchUserData.country = '';
    for (let i = 0; i < event.length; i++) {
      this.searchUserData.country += this.countryArr[event[i] - 1].name + ',';
    }
    this.filterData();
  }
  filterData() {
    this.saveCurrentPage('1');
    this.fetchUsers();
  }

  confirm(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true })
    .result.then((result) => {
      if (result === 'Ok') {
        this.userService.removeUser(this.currentId).subscribe(() => {
          this.fetchUsers();
        });
      }
    }, (reason) => {
    });
  }
  editUser(id) {
    this.router.navigate([`/user/edit/${id}`]);
  }

  removeUser(id) {
    this.currentId = id;
    const el: HTMLElement = this.confirmModal_view.nativeElement as HTMLElement;
    el.click();
  }


}
