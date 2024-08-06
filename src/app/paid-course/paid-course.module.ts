import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidCourseRoutingModule } from './paid-course-routing.module';
import { PaidCourseComponent } from './paid-course.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [PaidCourseComponent],
  imports: [
    CommonModule,
    PaidCourseRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class PaidCourseModule { }
