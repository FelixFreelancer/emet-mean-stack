import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Utils } from '../utils';

export interface IMenuItem {
    id?: string;
    type: string;       // Possible values: link/dropDown/icon/separator/extLink
    name?: string;      // Used as display text for item and title for separator type
    state?: string;     // Router state
    icon?: string;      // Material icon name
    tooltip?: string;   // Tooltip text
    disabled?: boolean; // If true, item will not be appeared in sidenav.
    sub?: IChildItem[]; // Dropdown items
    badges?: IBadge[];
    active?: boolean;
}
export interface IChildItem {
    id?: string;
    parentId?: string;
    type?: string;
    name: string;       // Display text
    state?: string;     // Router state
    icon?: string;
    sub?: IChildItem[];
    active?: boolean;
}

interface IBadge {
    color: string;      // primary/accent/warn/hex color codes(#fff000)
    value: string;      // Display text
}

interface ISidebarState {
    sidenavOpen?: boolean;
    childnavOpen?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class UserNavigationService {
    public sidebarState: ISidebarState = {
        sidenavOpen: true,
        childnavOpen: false
    };
    constructor() {
    }

    defaultMenu: IMenuItem[] = [
        {
            name: 'Item Management',
            type: 'dropDown',
            icon: 'i-Library',
            sub: [
                { icon: 'i-Receipt-4', name: 'Item List', state: '/item/list', type: 'link' },
                { icon: 'i-Add-File', name: 'Add Item', state: '/item/add', type: 'link' },
            ]
        },
        {
            name: 'About',
            type: 'link',
            tooltip: 'About',
            icon: 'i-Internet',
            state: '/about'
        },
        {
            name: 'Support',
            type: 'extLink',
            tooltip: 'Documentation',
            icon: 'i-Support',
            state: 'http://demos.ui-lib.com/gull-doc'
        }
    ];


    // sets iconMenu as default;
    menuItems = new BehaviorSubject<IMenuItem[]>(this.defaultMenu);
    // navigation component has subscribed to this Observable
    menuItems$ = this.menuItems.asObservable();

    // populateIDs(items: any[], parentId?) {
    //     items.forEach(item => {
    //         let id = Utils.genId();
    //         item.id = id;
    //         if(parentId) {
    //             item.parentId = parentId;
    //         }
    //         if(item.sub) {
    //             this.populateIDs(item.sub, id);
    //         }
    //     })
    // }

    // You can customize this method to supply different menu for
    // different user type.
    // publishNavigationChange(menuType: string) {
    //   switch (userType) {
    //     case 'admin':
    //       this.menuItems.next(this.adminMenu);
    //       break;
    //     case 'user':
    //       this.menuItems.next(this.userMenu);
    //       break;
    //     default:
    //       this.menuItems.next(this.defaultMenu);
    //   }
    // }
}
