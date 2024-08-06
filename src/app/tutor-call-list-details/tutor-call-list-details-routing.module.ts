import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TutorCallListDetailComponent} from './tutor-call-list-details.component';

const routes: Routes = [
  {
    path: '',
    component: TutorCallListDetailComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TutorCallListDetailRoutingModule { }
