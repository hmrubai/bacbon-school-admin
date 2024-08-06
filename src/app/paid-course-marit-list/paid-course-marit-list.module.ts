import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidCourseMaritListRoutingModule } from './paid-course-marit-list-routing.module';
import { PaidCourseMaritListComponent } from './paid-course-marit-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [PaidCourseMaritListComponent],
  imports: [
    CommonModule,
    PaidCourseMaritListRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class PaidCourseMaritListModule { }
