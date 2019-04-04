import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../../services/navigation.service';
import { UserNavigationService } from '../../../services/user-navigation.service';
import { AdminNavigationService } from '../../../services/admin-navigation.service';
import { SearchService } from 'src/app/shared/services/search.service';
import { SharedAnimations } from 'src/app/shared/animations/shared-animations';
import { Router, RouteConfigLoadStart, ResolveStart, RouteConfigLoadEnd, ResolveEnd, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../service/auth.service';


@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
  animations: [SharedAnimations]
})
export class AdminLayoutComponent implements OnInit {
  moduleLoading: boolean;
  role: String;
  constructor(
    public navService: NavigationService,
    public adminNavService: AdminNavigationService,
    public userNavService: UserNavigationService,
    public searchService: SearchService,
    private router: Router,
    private _auth: AuthService,
    private activatedRoute: ActivatedRoute
  ) {
    this.activatedRoute.url.subscribe(activeUrl => {
    });
  }

  ngOnInit() {
    this.role = localStorage.getItem('role');
    this.router.events.subscribe(event => {
      if (event instanceof RouteConfigLoadStart || event instanceof ResolveStart) {
        this.moduleLoading = true;
      }
      if (event instanceof RouteConfigLoadEnd || event instanceof ResolveEnd) {
        this.moduleLoading = false;
      }
    });
  }

}
