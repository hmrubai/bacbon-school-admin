import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectLevelVideoSmTestListRoutingModule } from './subject-level-video-small-test-list-routing.module';
import { SubjectLevelVideoSmTestListComponent } from './subject-level-video-small-test-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SubjectLevelVideoSmTestListComponent],
  imports: [
    CommonModule,
    SubjectLevelVideoSmTestListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class SubjectLevelVideoSmTestListModule { }
