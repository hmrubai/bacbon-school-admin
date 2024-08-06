import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearnerListRoutingModule } from './learner-list-routing.module';
import { LearnerListComponent } from './learner-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [LearnerListComponent],
  imports: [
    CommonModule,
    LearnerListRoutingModule,
    SharedModule,
    NgbTooltipModule,
    CollapseModule.forRoot(),
  ]
})
export class LearnerListModule { }
