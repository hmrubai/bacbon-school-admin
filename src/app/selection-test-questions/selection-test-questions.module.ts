import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectionTestQuestionsRoutingModule } from './selection-test-questions-routing.module';
import { SelectionTestQuestionsComponent } from './selection-test-questions.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [SelectionTestQuestionsComponent],
  imports: [
    CommonModule,
    SelectionTestQuestionsRoutingModule,
    SharedModule,
    NgbTooltipModule,
    CollapseModule.forRoot(),
  ]
})
export class SelectionTestQuestionsModule { }
