import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ExamParticipationRoutingModule } from './exam-participation-routing.module';
import { ExamParticipationComponent } from './exam-participation.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
@NgModule({
  declarations: [ExamParticipationComponent],
  imports: [
    CommonModule,
    ExamParticipationRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule 
  ]
})
export class ExamParticipationModule { }
