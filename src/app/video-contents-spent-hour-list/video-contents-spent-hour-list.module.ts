import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VideoContentsSpentHourListRoutingModule } from './video-contents-spent-hour-list-routing.module';
import { VideoContentsSpentHourListComponent } from './video-contents-spent-hour-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [VideoContentsSpentHourListComponent],
  imports: [
    CommonModule,
    VideoContentsSpentHourListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class VideoContentsSpentHourListModule { }
