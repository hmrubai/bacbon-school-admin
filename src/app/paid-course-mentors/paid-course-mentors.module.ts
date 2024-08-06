import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidCourseMentorsRoutingModule } from './paid-course-mentors-routing.module';
import { PaidCourseMentorsComponent } from './paid-course-mentors.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [PaidCourseMentorsComponent],
  imports: [
    CommonModule,
    PaidCourseMentorsRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class PaidCourseMentorsModule { }
