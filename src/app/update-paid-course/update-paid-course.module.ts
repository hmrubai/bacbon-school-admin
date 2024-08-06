import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UpdatePaidCourseRoutingModule } from './update-paid-course-routing.module';
import { UpdatePaidCourseComponent } from './update-paid-course.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [UpdatePaidCourseComponent],
  imports: [
    CommonModule,
    UpdatePaidCourseRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class UpdatePaidCourseModule { }
