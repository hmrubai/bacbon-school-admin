import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {BigTestQuestionAnswerListComponent} from './big-test-question-answer-list.component';

const routes: Routes = [
  {
    path: '',
    component: BigTestQuestionAnswerListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BigTestQuestionAnswerListRoutingModule { }
