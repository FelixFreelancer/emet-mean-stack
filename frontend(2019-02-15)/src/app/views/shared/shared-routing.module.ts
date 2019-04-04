import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { UploadDummyComponent } from './upload-dummy/upload-dummy.component';
const routes: Routes = [
  {
    path: '',
    component: AboutComponent
  },
  {
    path: 'uploadDummy',
    component: UploadDummyComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SharedRoutingModule { }
