import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpentHoursRoutingModule } from './spent-hours-routing.module';
import { SpentHoursComponent } from './spent-hours.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
@NgModule({
  declarations: [SpentHoursComponent],
  imports: [
    CommonModule,
    SpentHoursRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
  ]
})
export class SpentHoursModule { }
