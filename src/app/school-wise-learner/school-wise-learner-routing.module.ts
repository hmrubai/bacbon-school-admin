import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SchoolWiseLearnerComponent} from './school-wise-learner.component';

const routes: Routes = [
  {
    path: '',
    component: SchoolWiseLearnerComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolWiseLearnerRoutingModule { }
