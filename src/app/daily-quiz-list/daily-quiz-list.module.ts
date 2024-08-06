import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DailyQuizListRoutingModule } from './daily-quiz-list-routing.module';
import { DailyQuizListComponent } from './daily-quiz-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [DailyQuizListComponent],
  imports: [
    CommonModule,
    DailyQuizListRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class DailyQuizListModule { }
