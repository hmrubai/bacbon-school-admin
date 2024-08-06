import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearnerDetailsRoutingModule } from './learner-details-routing.module';
import { LearnerDetailsComponent } from './learner-details.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HighchartsChartModule } from 'highcharts-angular';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [LearnerDetailsComponent],
  imports: [
    CommonModule,
    LearnerDetailsRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule ,
    HighchartsChartModule,
    CollapseModule.forRoot(),
  ]
})
export class LearnerDetailsModule { }
