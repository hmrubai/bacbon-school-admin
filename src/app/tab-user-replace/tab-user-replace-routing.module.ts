import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TabUserReplaceComponent} from './tab-user-replace.component';

const routes: Routes = [
  {
    path: '',
    component: TabUserReplaceComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabUserReplaceRoutingModule { }
