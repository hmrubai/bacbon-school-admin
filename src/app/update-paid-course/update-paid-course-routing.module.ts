import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UpdatePaidCourseComponent} from './update-paid-course.component';

const routes: Routes = [
  {
    path: '',
    component: UpdatePaidCourseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UpdatePaidCourseRoutingModule { }
