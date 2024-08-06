import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExamParticipationListComponent} from './exam-participation-list.component';

const routes: Routes = [
  {
    path: '',
    component: ExamParticipationListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamParticipationListRoutingModule { }
