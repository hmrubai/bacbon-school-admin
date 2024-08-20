import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidCourseCompletedClassRoutingModule } from './paid-course-completed-class-routing.module';
import { PaidCourseCompletedClassComponent } from './paid-course-completed-class.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [PaidCourseCompletedClassComponent],
  imports: [
    CommonModule,
    PaidCourseCompletedClassRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class PaidCourseCompletedClassModule { }
