import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidCourseLCActivateRoutingModule } from './paid-course-lc-activate-routing.module';
import { PaidCourseLCActivateComponent } from './paid-course-lc-activate.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [PaidCourseLCActivateComponent],
  imports: [
    CommonModule,
    PaidCourseLCActivateRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class PaidCourseLCActivateModule { }
