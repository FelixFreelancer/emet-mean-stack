import { Component, OnInit } from '@angular/core';
import { DataLayerService } from '../../../services/data-layer.service';
import { Observable, combineLatest } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, debounceTime, switchMap, map } from 'rxjs/operators';
import { SharedAnimations } from '../../../animations/shared-animations';
import { SearchService } from '../../../services/search.service';
import { UserService } from 'src/app/shared/services/user.service';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { UrlJSON } from '../../../../views/json/urlJSON';

@Component({
  selector: 'app-user-search',
  templateUrl: './user-search.component.html',
  styleUrls: ['./user-search.component.scss'],
  animations: [SharedAnimations]
})
export class UserSearchComponent implements OnInit {
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
  users: any[] = [];
  filteredUsers: any[] = [];
  searchData = {searchText : ''};
  searchCtrl: FormControl = new FormControl('');

  constructor(
    private dl: DataLayerService,
    public searchService: SearchService,
    private userService: UserService,
    private router: Router
  ) { }
  goHome() {
    this.searchService.searchUserOpen = false;
    this.router.navigate(['/user/list/']);
  }

  editUser(id) {
      this.searchService.searchUserOpen = false;
      this.router.navigate([`/user/edit/${id}`]);
  }
  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.fetchUsers();
  }

  jsonToString(arr) {
    let return_val = '';
    for (let i = 0; i < arr.length; i++) {
      return_val += arr[i].name + ',';
    }
    return return_val;
  }

  editUserDirectly(id) {
    this.router.navigate([`/user/edit/${id}`]);
  }

  gotoPage(page) {
    if (page < 1 || page > this.pages) {
      return;
    }
    this.page = page;
    this.fetchUsers();
  }
  gotoPreviousPage() {
    if (Number(this.current) - 1 === 0) {
      return;
    } else {
      this.page = Number(this.current) - 1;
      this.fetchUsers();
    }
  }
  gotoNextPage() {
    if (Number(this.current) + 1 > this.pages) {
      return;
    } else {
      this.page = Number(this.current) + 1;
      this.fetchUsers();
    }
  }
  pageChange(event) {
    // this.page = event;
    // console.log(event);
  }

  fetchUsers() {
    this.userService.getUsersForSearch(this.page, this.searchData)
    .subscribe((val: any[]) => {
      const user = val['user'];
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


      this.users = [...user];
      this.filteredUsers = user;
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

  fetchData() {
    this.page = 1;
    this.fetchUsers();
  }

}
