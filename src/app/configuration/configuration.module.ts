import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SystemConfigurationRoutingModule } from './configuration-routing.module';
import { SystemConfigurationComponent } from './configuration.component';
import { SharedModule } from '../theme/shared/shared.module';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';


@NgModule({
  declarations: [SystemConfigurationComponent],
  imports: [
    CommonModule,
    SystemConfigurationRoutingModule,
    SharedModule,
    NgxMaterialTimepickerModule,
    
  ]
})
export class SystemConfigurationModule { }
