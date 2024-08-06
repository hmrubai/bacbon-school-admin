import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ExpertDetailsComponent} from './expert-details.component';

const routes: Routes = [
  {
    path: '',
    component: ExpertDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExpertDetailsRoutingModule { }
