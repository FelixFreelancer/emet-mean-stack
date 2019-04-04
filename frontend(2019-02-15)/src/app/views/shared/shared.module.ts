import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';

import { SharedRoutingModule } from './shared-routing.module';
import { FileUploadModule } from 'ng2-file-upload';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { MultiselectDropdownModule } from 'angular-2-dropdown-multiselect';
import { AboutComponent } from './about/about.component';
import { UploadDummyComponent } from './upload-dummy/upload-dummy.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgxPaginationModule,
    NgxDatatableModule,
    NgbModule,
    SharedRoutingModule,
    HttpClientModule,
    FileUploadModule,
    MultiselectDropdownModule,
  ],
  declarations: [ AboutComponent, UploadDummyComponent]
})
export class SharedModule { }
