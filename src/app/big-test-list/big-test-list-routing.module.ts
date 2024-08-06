import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BigTestListComponent} from './big-test-list.component';

const routes: Routes = [
  {
    path: '',
    component: BigTestListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BigTestListRoutingModule { }
