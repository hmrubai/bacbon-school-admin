import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamParticipationListRoutingModule } from './exam-participation-list-routing.module';
import { ExamParticipationListComponent } from './exam-participation-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ExamParticipationListComponent],
  imports: [
    CommonModule,
    ExamParticipationListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class ExamParticipationListModule { }
