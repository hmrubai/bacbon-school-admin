import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaidCourseLCActivateComponent} from './paid-course-lc-activate.component';

const routes: Routes = [
  {
    path: '',
    component: PaidCourseLCActivateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidCourseLCActivateRoutingModule { }
