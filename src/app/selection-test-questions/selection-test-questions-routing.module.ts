import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SelectionTestQuestionsComponent} from './selection-test-questions.component';

const routes: Routes = [
  {
    path: '',
    component: SelectionTestQuestionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectionTestQuestionsRoutingModule { }
