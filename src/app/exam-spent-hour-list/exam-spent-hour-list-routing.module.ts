import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExamSpentHourListComponent} from './exam-spent-hour-list.component';

const routes: Routes = [
  {
    path: '',
    component: ExamSpentHourListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamSpentHourListRoutingModule { }
