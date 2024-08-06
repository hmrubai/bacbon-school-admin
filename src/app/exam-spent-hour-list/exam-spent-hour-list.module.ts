import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamSpentHourListRoutingModule } from './exam-spent-hour-list-routing.module';
import { ExamSpentHourListComponent } from './exam-spent-hour-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ExamSpentHourListComponent],
  imports: [
    CommonModule,
    ExamSpentHourListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class ExamSpentHourListModule { }
