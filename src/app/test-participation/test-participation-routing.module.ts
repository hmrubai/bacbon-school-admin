import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TestParticipationComponent} from './test-participation.component';

const routes: Routes = [
  {
    path: '',
    component: TestParticipationComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestParticipationRoutingModule { }
