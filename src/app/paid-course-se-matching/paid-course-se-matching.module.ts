import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidCourseSEMacthingRoutingModule } from './paid-course-se-matching-routing.module';
import { PaidCourseSEMacthingComponent } from './paid-course-se-matching.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [PaidCourseSEMacthingComponent],
  imports: [
    CommonModule,
    PaidCourseSEMacthingRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class PaidCourseSEMacthingModule { }
