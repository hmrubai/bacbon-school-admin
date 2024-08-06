import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LearnerListComponent} from './learner-list.component';

const routes: Routes = [
  {
    path: '',
    component: LearnerListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnerListRoutingModule { }
