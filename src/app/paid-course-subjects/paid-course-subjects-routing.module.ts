import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaidCourseSubjectsComponent} from './paid-course-subjects.component';

const routes: Routes = [
  {
    path: '',
    component: PaidCourseSubjectsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidCourseSubjectsRoutingModule { }
