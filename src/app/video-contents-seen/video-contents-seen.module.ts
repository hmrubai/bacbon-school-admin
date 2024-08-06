import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoContentsSeenRoutingModule } from './video-contents-seen-routing.module';
import { VideoContentsSeenComponent } from './video-contents-seen.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CollapseModule } from 'ngx-bootstrap/collapse';
@NgModule({
  declarations: [VideoContentsSeenComponent],
  imports: [
    CommonModule,
    VideoContentsSeenRoutingModule,
    SharedModule,
    NgbTooltipModule,
    TooltipModule,
    CollapseModule.forRoot(),

  ]
})
export class VideoContentsSeenModule { }
