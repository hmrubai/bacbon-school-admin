import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidCourseTestRoutingModule } from './paid-course-tests-routing.module';
import { PaidCourseTestComponent } from './paid-course-tests.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [PaidCourseTestComponent],
  imports: [
    CommonModule,
    PaidCourseTestRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class PaidCourseTestModule { }
