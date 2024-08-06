import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ScriptSpentHourListComponent} from './script-spent-hour-list.component';

const routes: Routes = [
  {
    path: '',
    component: ScriptSpentHourListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScriptSpentHourListRoutingModule { }
