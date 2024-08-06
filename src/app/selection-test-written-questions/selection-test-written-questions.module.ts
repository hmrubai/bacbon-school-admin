import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectionTestWrittenQuestionsRoutingModule } from './selection-test-written-questions-routing.module';
import { SelectionTestWrittenQuestionsComponent } from './selection-test-written-questions.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [SelectionTestWrittenQuestionsComponent],
  imports: [
    CommonModule,
    SelectionTestWrittenQuestionsRoutingModule,
    SharedModule,
    NgbTooltipModule,
    CollapseModule.forRoot(),
  ]
})
export class SelectionTestWrittenQuestionsModule { }
