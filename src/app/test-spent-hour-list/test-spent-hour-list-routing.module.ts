import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {TestSpentHourListComponent} from './test-spent-hour-list.component';

const routes: Routes = [
  {
    path: '',
    component: TestSpentHourListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TestSpentHourListRoutingModule { }
