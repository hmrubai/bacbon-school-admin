import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LearnerDetailsComponent} from './learner-details.component';

const routes: Routes = [
  {
    path: '',
    component: LearnerDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnerDetailsRoutingModule { }
