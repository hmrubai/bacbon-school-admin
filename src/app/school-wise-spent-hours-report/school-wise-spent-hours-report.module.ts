import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolWiseSpentHoursReportRoutingModule } from './school-wise-spent-hours-report-routing.module';
import { SchoolWiseSpentHoursReportComponent } from './school-wise-spent-hours-report.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';
@NgModule({
  declarations: [SchoolWiseSpentHoursReportComponent],
  imports: [
    CommonModule,
    SchoolWiseSpentHoursReportRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule,
  ]
})
export class SchoolWiseSpentHoursReportModule { }
