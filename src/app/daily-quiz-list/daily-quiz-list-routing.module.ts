import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {DailyQuizListComponent} from './daily-quiz-list.component';

const routes: Routes = [
  {
    path: '',
    component: DailyQuizListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DailyQuizListRoutingModule { }
