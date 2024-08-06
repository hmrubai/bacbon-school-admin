import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SubjectLevelAudioRoutingModule } from './subject-level-audio-routing.module';
import { SubjectLevelAudioComponent } from './subject-level-audio.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SubjectLevelAudioComponent],
  imports: [
    CommonModule,
    SubjectLevelAudioRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class SubjectLevelAudioModule { }
