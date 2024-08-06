import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { CallHistoryReportComponent } from './call-history-report.component';
import { CallHistoryReportRoutes } from './call-history-report.routing';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { SharedModule } from '../theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CallHistoryReportRoutes),
    SharedModule,
    PdfJsViewerModule
  ],
  declarations: [CallHistoryReportComponent]
})

export class CallHistoryReportModule { }
