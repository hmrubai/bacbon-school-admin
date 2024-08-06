import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExpertDetailsRoutingModule } from './expert-details-routing.module';
import { ExpertDetailsComponent } from './expert-details.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [ExpertDetailsComponent],
  imports: [
    CommonModule,
    ExpertDetailsRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class ExpertDetailsModule { }
