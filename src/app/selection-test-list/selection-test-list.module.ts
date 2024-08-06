import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectionTestListRoutingModule } from './selection-test-list-routing.module';
import { SelectionTestListComponent } from './selection-test-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { HighchartsChartModule } from 'highcharts-angular';



@NgModule({
  declarations: [SelectionTestListComponent],
  imports: [
    CommonModule,
    SelectionTestListRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
    HighchartsChartModule 
  ],
})
export class SelectionTestListModule { }
