import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { AdminNavigationService } from '../../services/admin-navigation.service';
import { UserNavigationService } from '../../services/user-navigation.service';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../../service/auth.service';
import { Router, ActivatedRoute, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd } from '@angular/router';
import { UrlJSON } from '../../../views/json/urlJSON';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  notifications: any[];
  userName: String;
  userId: String;
  role: String;
  picture: String;
  extraBlob: String;

  constructor(
    private navService: NavigationService,
    private adminNavService: AdminNavigationService,
    private userNavService: UserNavigationService,
    public searchService: SearchService,
    private auth: AuthService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.notifications = [
      {
        icon: 'i-Speach-Bubble-6',
        title: 'New message',
        badge: '3',
        text: 'James: Hey! are you busy?',
        time: new Date(),
        status: 'primary',
        link: '/chat'
      },
      {
        icon: 'i-Receipt-3',
        title: 'New order received',
        badge: '$4036',
        text: '1 Headphone, 3 iPhone x',
        time: new Date('11/11/2018'),
        status: 'success',
        link: '/tables/full'
      },
      {
        icon: 'i-Empty-Box',
        title: 'Product out of stock',
        text: 'Headphone E67, R98, XL90, Q77',
        time: new Date('11/10/2018'),
        status: 'danger',
        link: '/tables/list'
      },
      {
        icon: 'i-Data-Power',
        title: 'Server up!',
        text: 'Server rebooted successfully',
        time: new Date('11/08/2018'),
        status: 'success',
        link: '/dashboard/v2'
      },
      {
        icon: 'i-Data-Block',
        title: 'Server down!',
        badge: 'Resolved',
        text: 'Region 1: Server crashed!',
        time: new Date('11/06/2018'),
        status: 'danger',
        link: '/dashboard/v3'
      }
    ];
  }

  ngOnInit() {
    this.userName = localStorage.getItem('userName');
    this.userId = localStorage.getItem('userId');
    this.role = localStorage.getItem('role');
    this.picture = localStorage.getItem('picture');
    this.extraBlob = localStorage.getItem('extraBlob');
    if (this.picture === 'default.png') {
      this.picture = '../../../../assets/images/avatar/default.png';
    } else {
      if (this.extraBlob === '2') {
        this.picture = UrlJSON.displayAvatarFromFSUrl + this.picture;
      } else {
        this.picture =  UrlJSON.displayPictureUrl + this.picture;
      }
    }
  }
  goHome() {
    if (this.role === '1') {
      this.router.navigate(['/user/list/']);
    } else {
      this.router.navigate(['/item/list/']);
    }
  }

  toggelSidebar() {
    const state = this.role === '1' ? this.adminNavService.sidebarState : this.userNavService.sidebarState ;
    // const state = this.navService.sidebarState ;
    // if(!state.sidenavOpen) {
    //   return state.sidenavOpen = true;
    // }
    if (state.childnavOpen && state.sidenavOpen) {
      return state.childnavOpen = false;
    }
    if (!state.childnavOpen && state.sidenavOpen) {
      return state.sidenavOpen = false;
    }
    if (!state.sidenavOpen && !state.childnavOpen) {
        state.sidenavOpen = true;
        setTimeout(() => {
            state.childnavOpen = true;
        }, 50);
    }
  }

  profileChange() {
    this.router.navigate([`/user/edit/${this.userId}`]);
    // if (this.role === '1') { // admin
    //   this.router.navigate([`/admin/edit/${this.userId}`]);
    // } else { // user
    //   this.router.navigate([`/user/edit/${this.userId}`]);
    // }
  }
  signout() {
    this.auth.signout();
  }

  focus() {
    const url = this.router.url.split('/')[1];
    if (url === 'user') {
      this.searchService.searchUserOpen = true;
    } else {
      this.searchService.searchOpen = true;
    }
  }

}
