import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DeviceListRoutingModule } from './device-list-routing.module';
import { DeviceListComponent } from './device-list.component';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [DeviceListComponent],
  imports: [
    CommonModule,
    DeviceListRoutingModule,
    SharedModule,
    NgbTooltipModule
  ]
})
export class DeviceListModule { }
