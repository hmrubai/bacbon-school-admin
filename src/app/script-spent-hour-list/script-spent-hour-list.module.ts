import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScriptSpentHourListRoutingModule } from './script-spent-hour-list-routing.module';
import { ScriptSpentHourListComponent } from './script-spent-hour-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ScriptSpentHourListComponent],
  imports: [
    CommonModule,
    ScriptSpentHourListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class ScriptSpentHourListModule { }
