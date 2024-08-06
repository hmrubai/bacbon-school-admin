import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestParticipationListRoutingModule } from './test-participation-list-routing.module';
import { TestParticipationListComponent } from './test-participation-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TestParticipationListComponent],
  imports: [
    CommonModule,
    TestParticipationListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class TestParticipationListModule { }
