import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaidCoursePaymentsComponent} from './paid-course-payments.component';

const routes: Routes = [
  {
    path: '',
    component: PaidCoursePaymentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidCoursePaymentsRoutingModule { }
