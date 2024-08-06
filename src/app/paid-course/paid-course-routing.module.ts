import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaidCourseComponent} from './paid-course.component';

const routes: Routes = [
  {
    path: '',
    component: PaidCourseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidCourseRoutingModule { }
