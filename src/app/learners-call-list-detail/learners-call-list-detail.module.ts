import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LearnersCallListDetailRoutingModule } from './learners-call-list-detail-routing.module';
import { LearnersCallListDetailComponent } from './learners-call-list-detail.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [LearnersCallListDetailComponent],
  imports: [
    CommonModule,
    LearnersCallListDetailRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class LearnersCallListDetailModule { }
