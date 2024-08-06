import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SchoolWiseLearnerRoutingModule } from './school-wise-learner-routing.module';
import { SchoolWiseLearnerComponent } from './school-wise-learner.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
@NgModule({
  declarations: [SchoolWiseLearnerComponent],
  imports: [
    CommonModule,
    SchoolWiseLearnerRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),

  ]
})
export class SchoolWiseLearnerModule { }
