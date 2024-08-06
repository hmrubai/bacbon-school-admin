import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BigTestQuestionAnswerListRoutingModule } from './big-test-question-answer-list-routing.module';
import { BigTestQuestionAnswerListComponent } from './big-test-question-answer-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [BigTestQuestionAnswerListComponent],
  imports: [
    CommonModule,
    BigTestQuestionAnswerListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class BigTestQuestionAnswerListModule { }
