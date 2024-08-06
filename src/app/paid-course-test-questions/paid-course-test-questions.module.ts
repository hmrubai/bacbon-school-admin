import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PaidCourseTestQuestionsRoutingModule } from './paid-course-test-questions-routing.module';
import { PaidCourseTestQuestionsComponent } from './paid-course-test-questions.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [PaidCourseTestQuestionsComponent],
  imports: [
    CommonModule,
    PaidCourseTestQuestionsRoutingModule,
    SharedModule,
    NgbTooltipModule,
    CollapseModule.forRoot(),
  ]
})
export class PaidCourseTestQuestionsModule { }
