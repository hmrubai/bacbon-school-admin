import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SmallTestListRoutingModule } from './small-test-list-routing.module';
import { SmallTestListComponent } from './small-test-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [SmallTestListComponent],
  imports: [
    CommonModule,
    SmallTestListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class SmallTestListModule { }
