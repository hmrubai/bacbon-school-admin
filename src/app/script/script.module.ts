import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ScriptListRoutingModule } from './script-routing.module';
import { ScriptListComponent } from './script.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [ScriptListComponent],
  imports: [
    CommonModule,
    ScriptListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class ScriptListModule { }
