import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SmallTestQuestionAnswerListComponent} from './small-test-question-answer-list.component';

const routes: Routes = [
  {
    path: '',
    component: SmallTestQuestionAnswerListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SmallTestQuestionAnswerListRoutingModule { }
