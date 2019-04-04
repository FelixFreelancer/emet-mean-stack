import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgxPaginationModule } from 'ngx-pagination';

import { ItemRoutingModule } from './item-routing.module';
import { FileUploadModule } from 'ng2-file-upload';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemAddComponent } from './item-add/item-add.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { ItemDisplayComponent } from './item-display/item-display.component';
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
    ItemRoutingModule,
    HttpClientModule,
    FileUploadModule,
    MultiselectDropdownModule,
    SharedPipesModule
  ],
  declarations: [ItemListComponent, ItemAddComponent, ItemEditComponent, ItemDisplayComponent]
})
export class ItemModule { }
