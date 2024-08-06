import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaidCourseMentorsComponent} from './paid-course-mentors.component';

const routes: Routes = [
  {
    path: '',
    component: PaidCourseMentorsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidCourseMentorsRoutingModule { }
