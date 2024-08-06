import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidCourseResultsRoutingModule } from './paid-course-results-routing.module';
import { PaidCourseResultsComponent } from './paid-course-results.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [PaidCourseResultsComponent],
  imports: [
    CommonModule,
    PaidCourseResultsRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class PaidCourseResultsModule { }
