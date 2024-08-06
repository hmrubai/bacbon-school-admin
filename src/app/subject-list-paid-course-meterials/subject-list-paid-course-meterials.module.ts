import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectListPaidCourseMeterialsRoutingModule } from './subject-list-paid-course-meterials-routing.module';
import { SubjectListPaidCourseMeterialsComponent } from './subject-list-paid-course-meterials.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [SubjectListPaidCourseMeterialsComponent],
  imports: [
    CommonModule,
    SubjectListPaidCourseMeterialsRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class SubjectListPaidCourseMeterialsModule { }
