import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ParticipantListComponent} from './participant-list.component';

const routes: Routes = [
  {
    path: '',
    component: ParticipantListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ParticipantListRoutingModule { }
