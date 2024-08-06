import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidCourseQuotaRoutingModule } from './paid-course-quota-routing.module';
import { PaidCourseQuotaComponent } from './paid-course-quota.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [PaidCourseQuotaComponent],
  imports: [
    CommonModule,
    PaidCourseQuotaRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class PaidCourseQuotaModule { }
