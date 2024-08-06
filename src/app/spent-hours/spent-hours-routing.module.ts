import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SpentHoursComponent} from './spent-hours.component';

const routes: Routes = [
  {
    path: '',
    component: SpentHoursComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SpentHoursRoutingModule { }
