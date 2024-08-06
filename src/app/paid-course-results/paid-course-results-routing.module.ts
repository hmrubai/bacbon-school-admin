import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaidCourseResultsComponent} from './paid-course-results.component';

const routes: Routes = [
  {
    path: '',
    component: PaidCourseResultsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidCourseResultsRoutingModule { }
