import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmallTestQuestionAnswerListRoutingModule } from './small-test-question-answer-list-routing.module';
import { SmallTestQuestionAnswerListComponent } from './small-test-question-answer-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SmallTestQuestionAnswerListComponent],
  imports: [
    CommonModule,
    SmallTestQuestionAnswerListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class SmallTestQuestionAnswerListModule { }
