import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TutorCallListDetailRoutingModule } from './tutor-call-list-details-routing.module';
import { TutorCallListDetailComponent } from './tutor-call-list-details.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TutorCallListDetailComponent],
  imports: [
    CommonModule,
    TutorCallListDetailRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class TutorCallListDetailModule { }
