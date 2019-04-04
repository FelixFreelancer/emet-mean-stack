import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ItemListComponent } from './item-list/item-list.component';
import { ItemAddComponent } from './item-add/item-add.component';
import { ItemEditComponent } from './item-edit/item-edit.component';
import { ItemDisplayComponent } from './item-display/item-display.component';

const routes: Routes = [
  {
    path: 'list',
    component: ItemListComponent
  },
  {
    path: 'add',
    component: ItemAddComponent
  },
  {
    path: 'edit/:id',
    component: ItemEditComponent
  },
  {
    path: 'display/:id',
    component: ItemDisplayComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ItemRoutingModule { }
