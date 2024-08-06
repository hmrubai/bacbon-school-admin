import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SchoolWiseSpentHoursReportComponent} from './school-wise-spent-hours-report.component';

const routes: Routes = [
  {
    path: '',
    component: SchoolWiseSpentHoursReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SchoolWiseSpentHoursReportRoutingModule { }
