import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SubjectLevelBigTestListComponent} from './subject-level-big-test-list.component';

const routes: Routes = [
  {
    path: '',
    component: SubjectLevelBigTestListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectLevelBigTestListRoutingModule { }
