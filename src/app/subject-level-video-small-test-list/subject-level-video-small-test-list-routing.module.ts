import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SubjectLevelVideoSmTestListComponent} from './subject-level-video-small-test-list.component';

const routes: Routes = [
  {
    path: '',
    component: SubjectLevelVideoSmTestListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectLevelVideoSmTestListRoutingModule { }
