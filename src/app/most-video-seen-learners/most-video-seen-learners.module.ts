import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MostVideoSeenLearnersComponent } from './most-video-seen-learners.component';
import { MostVideoSeenLearnersRoutes } from './most-video-seen-learners.routing';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { SharedModule } from '../theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(MostVideoSeenLearnersRoutes),
    SharedModule,
    PdfJsViewerModule
  ],
  declarations: [MostVideoSeenLearnersComponent]
})

export class MostVideoSeenLearnersModule { }
