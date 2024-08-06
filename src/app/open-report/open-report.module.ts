import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { OpenReportComponent } from './open-report.component';
import { OpenReportRoutes } from './open-report.routing';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { SharedModule } from '../theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(OpenReportRoutes),
    SharedModule,
    PdfJsViewerModule
  ],
  declarations: [OpenReportComponent]
})

export class OpenReportModule { }
