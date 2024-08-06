import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TestParticipationRoutingModule } from './test-participation-routing.module';
import { TestParticipationComponent } from './test-participation.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
@NgModule({
  declarations: [TestParticipationComponent],
  imports: [
    CommonModule,
    TestParticipationRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),
  ]
})
export class TestParticipationModule { }
