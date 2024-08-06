import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SmallTestListComponent} from './small-test-list.component';

const routes: Routes = [
  {
    path: '',
    component: SmallTestListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmallTestListRoutingModule { }
