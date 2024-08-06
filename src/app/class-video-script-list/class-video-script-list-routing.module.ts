import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ClassVideoScriptListComponent} from './class-video-script-list.component';

const routes: Routes = [
  {
    path: '',
    component: ClassVideoScriptListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClassVideoScriptListRoutingModule { }
