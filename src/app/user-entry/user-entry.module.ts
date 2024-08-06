import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserEntryRoutingModule } from './user-entry-routing.module';
import { UserEntryComponent } from './user-entry.component';
import { SharedModule } from '../theme/shared/shared.module';

@NgModule({
  declarations: [UserEntryComponent],
  imports: [
    CommonModule,
    UserEntryRoutingModule,
    SharedModule
  ]
})
export class UserEntryModule { }
