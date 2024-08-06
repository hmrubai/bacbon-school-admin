import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClassVideoScriptListRoutingModule } from './class-video-script-list-routing.module';
import { ClassVideoScriptListComponent } from './class-video-script-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ClassVideoScriptListComponent],
  imports: [
    CommonModule,
    ClassVideoScriptListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class ClassVideoScriptListModule { }
