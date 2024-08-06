import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LearnersCallListDetailComponent} from './learners-call-list-detail.component';

const routes: Routes = [
  {
    path: '',
    component: LearnersCallListDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LearnersCallListDetailRoutingModule { }
