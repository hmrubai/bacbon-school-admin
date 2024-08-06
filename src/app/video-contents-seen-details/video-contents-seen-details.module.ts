import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoContentsSeenDetailsRoutingModule } from './video-contents-seen-details-routing.module';
import { VideoContentsSeenDetailsComponent } from './video-contents-seen-details.component';
import { SharedModule } from '../theme/shared/shared.module';

@NgModule({
  declarations: [VideoContentsSeenDetailsComponent],
  imports: [
    CommonModule,
    VideoContentsSeenDetailsRoutingModule,
    SharedModule
  ]
})
export class VideoContentsSeenDetailsModule { }
