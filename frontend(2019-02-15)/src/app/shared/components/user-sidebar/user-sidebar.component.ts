import { Component, OnInit, HostListener } from '@angular/core';
// import { NavigationService, IMenuItem, IChildItem } from '../../services/navigation.service';
import { UserNavigationService, IMenuItem, IChildItem } from '../../services/user-navigation.service';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Utils } from '../../utils';
import { AuthService } from '../../../service/auth.service';

@Component({
	selector: 'app-user-sidebar',
	templateUrl: './user-sidebar.component.html',
	styleUrls: ['./user-sidebar.component.scss'],
})
export class UserSidebarComponent implements OnInit {
	selectedItem: IMenuItem;

	user_id = '-1';
	role = 0;
	nav: IMenuItem[];

	constructor(
		public router: Router,
		public navService: UserNavigationService,
		private _auth: AuthService
	) { }

	ngOnInit() {

		this.updateSidebar();
		this.user_id = localStorage.getItem('userId');
		// CLOSE SIDENAV ON ROUTE CHANGE
		this.router.events.pipe(filter(event => event instanceof NavigationEnd))
			.subscribe((routeChange) => {
				this.closeChildNav();
				if (Utils.isMobile()) {
					this.navService.sidebarState.sidenavOpen = false;
				}
			});

		this.navService.menuItems$
			.subscribe((items) => {
				this.nav = items;
				this.setActiveFlag();
			});
			this.role = this._auth.role;
	}

	selectItem(item) {
		this.navService.sidebarState.childnavOpen = true;
		this.selectedItem = item;
		this.setActiveMainItem(item);
	}
	closeChildNav() {
		this.navService.sidebarState.childnavOpen = false;
		this.setActiveFlag();
	}

	onClickChangeActiveFlag(item) {
		this.setActiveMainItem(item);
	}
	setActiveMainItem(item) {
		this.nav.forEach(item => {
			item.active = false;
		});
		item.active = true;
	}

	setActiveFlag() {
		if (window && window.location) {
            const activeRoute = window.location.hash || window.location.pathname;
			this.nav.forEach(item => {
				item.active = false;
				if (activeRoute.indexOf(item.state) !== -1) {
                    this.selectedItem = item;
					item.active = true;
				}
				if (item.sub) {
					item.sub.forEach(subItem => {
                        subItem.active = false;
						if (activeRoute.indexOf(subItem.state) !== -1) {
                            this.selectedItem = item;
                            item.active = true;
                        }
                        if (subItem.sub) {
                            subItem.sub.forEach(subChildItem => {
                                if (activeRoute.indexOf(subChildItem.state) !== -1) {
                                    this.selectedItem = item;
                                    item.active = true;
                                    subItem.active = true;
                                }
                            });
                        }
					});
				}
            });
		}
    }

	updateSidebar() {
		if (Utils.isMobile()) {
			this.navService.sidebarState.sidenavOpen = false;
			this.navService.sidebarState.childnavOpen = false;
		} else {
			this.navService.sidebarState.sidenavOpen = true;
		}
	}

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.updateSidebar();
    }

    // updateActive(currentState: string, items: any[], parentItem?) {
    //     let indexes = [];
    //     console.log(items)
    //     items.forEach((item, i) => {
    //         item.active = false;
    //         console.log(item, i)
    //         if (currentState.indexOf(item.state) !== -1) {
    //             item.active = true;
    //             if(parentItem) {
    //                 parentItem.active = true;
    //             }
    //         }
    //         if (item.sub) {
    //             this.updateActive(currentState, item.sub, item)
    //         }
    //     });
    // }


}
