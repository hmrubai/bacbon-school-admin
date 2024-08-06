import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { InstructionAudiosComponent } from './instruction-audios.component';
import { InstructionAudiosRoutes } from './instruction-audios.routing';
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { SharedModule } from '../theme/shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(InstructionAudiosRoutes),
    SharedModule,
    PdfJsViewerModule
  ],
  declarations: [InstructionAudiosComponent]
})

export class InstructionAudiosModule { }
