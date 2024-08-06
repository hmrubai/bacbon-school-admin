import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BigTestListRoutingModule } from './big-test-list-routing.module';
import { BigTestListComponent } from './big-test-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [BigTestListComponent],
  imports: [
    CommonModule,
    BigTestListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class BigTestListModule { }
