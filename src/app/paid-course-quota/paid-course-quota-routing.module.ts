import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaidCourseQuotaComponent} from './paid-course-quota.component';

const routes: Routes = [
  {
    path: '',
    component: PaidCourseQuotaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidCourseQuotaRoutingModule { }
