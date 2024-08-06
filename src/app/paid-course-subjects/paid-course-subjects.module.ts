import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidCourseSubjectsRoutingModule } from './paid-course-subjects-routing.module';
import { PaidCourseSubjectsComponent } from './paid-course-subjects.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [PaidCourseSubjectsComponent],
  imports: [
    CommonModule,
    PaidCourseSubjectsRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class PaidCourseSubjectsModule { }
