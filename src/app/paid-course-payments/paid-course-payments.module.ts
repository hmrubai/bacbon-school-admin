import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidCoursePaymentsRoutingModule } from './paid-course-payments-routing.module';
import { PaidCoursePaymentsComponent } from './paid-course-payments.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [PaidCoursePaymentsComponent],
  imports: [
    CommonModule,
    PaidCoursePaymentsRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class PaidCoursePaymentsModule { }
