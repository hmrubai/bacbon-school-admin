import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SelectionTestListComponent} from './selection-test-list.component';

const routes: Routes = [
  {
    path: '',
    component: SelectionTestListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectionTestListRoutingModule { }
