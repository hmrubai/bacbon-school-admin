import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AddPaidCourseRoutingModule } from './add-paid-course-routing.module';
import { AddPaidCourseComponent } from './add-paid-course.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [AddPaidCourseComponent],
  imports: [
    CommonModule,
    AddPaidCourseRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class AddPaidCourseModule { }
