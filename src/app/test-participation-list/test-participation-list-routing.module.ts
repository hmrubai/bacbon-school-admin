import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TestParticipationListComponent} from './test-participation-list.component';

const routes: Routes = [
  {
    path: '',
    component: TestParticipationListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestParticipationListRoutingModule { }
