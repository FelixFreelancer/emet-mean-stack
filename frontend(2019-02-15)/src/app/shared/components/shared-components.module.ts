import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BtnLoadingComponent } from './btn-loading/btn-loading.component';
import { FeatherIconComponent } from './feather-icon/feather-icon.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { AdminSidebarComponent } from './admin-sidebar/admin-sidebar.component';
import { UserSidebarComponent } from './user-sidebar/user-sidebar.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { UserLayoutComponent } from './layouts/user-layout/user-layout.component';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { BlankLayoutComponent } from './layouts/blank-layout/blank-layout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { SharedPipesModule } from '../pipes/shared-pipes.module';
import { SearchModule } from './search/search.module';
import { SharedDirectivesModule } from '../directives/shared-directives.module';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { FooterComponent } from './footer/footer.component';
import { CustomizerComponent } from './customizer/customizer.component';

const components = [
  BtnLoadingComponent,
  FeatherIconComponent,
  HeaderComponent,
  SidebarComponent,
  AdminSidebarComponent,
  UserSidebarComponent,
  FooterComponent,
  CustomizerComponent,
  AdminLayoutComponent,
  UserLayoutComponent,
  AuthLayoutComponent,
  BlankLayoutComponent
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    SharedPipesModule,
    SharedDirectivesModule,
    SearchModule,
    PerfectScrollbarModule,
    NgbModule
  ],
  declarations: components,
  exports: components
})
export class SharedComponentsModule { }
