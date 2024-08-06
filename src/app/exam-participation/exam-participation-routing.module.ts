import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExamParticipationComponent} from './exam-participation.component';

const routes: Routes = [
  {
    path: '',
    component: ExamParticipationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamParticipationRoutingModule { }
