import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParticipantListRoutingModule } from './participant-list-routing.module';
import { ParticipantListComponent } from './participant-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { CollapseModule } from 'ngx-bootstrap/collapse';

@NgModule({
  declarations: [ParticipantListComponent],
  imports: [
    CommonModule,
    ParticipantListRoutingModule,
    SharedModule,
    NgbTooltipModule,
    CollapseModule.forRoot(),
  ]
})
export class ParticipantListModule { }
