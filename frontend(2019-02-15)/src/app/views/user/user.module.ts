import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';

import { UserRoutingModule } from './user-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserAddComponent } from './user-add/user-add.component';
import { FileUploadModule } from 'ng2-file-upload';
import { UserEditComponent } from './user-edit/user-edit.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { SharedPipesModule } from '../../shared/pipes/shared-pipes.module';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    NgbModule,
    UserRoutingModule,
    HttpClientModule,
    FileUploadModule,
    MultiselectDropdownModule,
    SharedPipesModule
  ],
  declarations: [UserListComponent, UserAddComponent, UserEditComponent]
})
export class UserModule { }
