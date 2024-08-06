import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaidCourseMaritListComponent} from './paid-course-marit-list.component';

const routes: Routes = [
  {
    path: '',
    component: PaidCourseMaritListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidCourseMaritListRoutingModule { }
