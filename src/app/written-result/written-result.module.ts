import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WrittenResultRoutingModule } from './written-result-routing.module';
import { WrittenResultComponent } from './written-result.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [WrittenResultComponent],
  imports: [
    CommonModule,
    WrittenResultRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class WrittenResultModule { }
