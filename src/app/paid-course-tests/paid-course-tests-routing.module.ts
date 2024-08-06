import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaidCourseTestComponent} from './paid-course-tests.component';

const routes: Routes = [
  {
    path: '',
    component: PaidCourseTestComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidCourseTestRoutingModule { }
