import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SubjectListPaidCourseMeterialsComponent} from './subject-list-paid-course-meterials.component';

const routes: Routes = [
  {
    path: '',
    component: SubjectListPaidCourseMeterialsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectListPaidCourseMeterialsRoutingModule { }
