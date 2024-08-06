import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestSpentHourListRoutingModule } from './test-spent-hour-list-routing.module';
import { TestSpentHourListComponent } from './test-spent-hour-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TestSpentHourListComponent],
  imports: [
    CommonModule,
    TestSpentHourListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class TestSpentHourListModule { }
