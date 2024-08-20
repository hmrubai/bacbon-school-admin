import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaidCourseCompletedClassComponent} from './paid-course-completed-class.component';

const routes: Routes = [
  {
    path: '',
    component: PaidCourseCompletedClassComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidCourseCompletedClassRoutingModule { }
