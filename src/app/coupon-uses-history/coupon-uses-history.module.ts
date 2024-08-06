import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CouponUsesHistoryRoutingModule } from './coupon-uses-history-routing.module';
import { CouponUsesHistoryComponent } from './coupon-uses-history.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [CouponUsesHistoryComponent],
  imports: [
    CommonModule,
    CouponUsesHistoryRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class CouponUsesHistoryModule { }
