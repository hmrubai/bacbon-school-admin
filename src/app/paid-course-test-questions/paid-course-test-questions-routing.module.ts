import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaidCourseTestQuestionsComponent} from './paid-course-test-questions.component';

const routes: Routes = [
  {
    path: '',
    component: PaidCourseTestQuestionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidCourseTestQuestionsRoutingModule { }
