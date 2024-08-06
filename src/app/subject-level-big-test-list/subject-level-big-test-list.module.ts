import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectLevelBigTestListRoutingModule } from './subject-level-big-test-list-routing.module';
import { SubjectLevelBigTestListComponent } from './subject-level-big-test-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SubjectLevelBigTestListComponent],
  imports: [
    CommonModule,
    SubjectLevelBigTestListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class SubjectLevelBigTestListModule { }
