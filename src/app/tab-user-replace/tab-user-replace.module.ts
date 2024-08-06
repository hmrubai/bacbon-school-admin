import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TabUserReplaceRoutingModule } from './tab-user-replace-routing.module';
import { TabUserReplaceComponent } from './tab-user-replace.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [TabUserReplaceComponent],
  imports: [
    CommonModule,
    TabUserReplaceRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class TabUserReplaceModule { }
