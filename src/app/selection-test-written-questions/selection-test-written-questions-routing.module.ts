import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SelectionTestWrittenQuestionsComponent} from './selection-test-written-questions.component';

const routes: Routes = [
  {
    path: '',
    component: SelectionTestWrittenQuestionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SelectionTestWrittenQuestionsRoutingModule { }
