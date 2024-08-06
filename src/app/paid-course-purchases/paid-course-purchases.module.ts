import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidCoursePurchasesRoutingModule } from './paid-course-purchases-routing.module';
import { PaidCoursePurchasesComponent } from './paid-course-purchases.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [PaidCoursePurchasesComponent],
  imports: [
    CommonModule,
    PaidCoursePurchasesRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class PaidCoursePurchasesModule { }
