import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { UserGroupListComponent } from './user-group-list.component';
import { UserGroupListRoutes } from './user-group-list.routing';
import { SharedModule } from '../theme/shared/shared.module';


@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(UserGroupListRoutes),
      SharedModule
  ],
  declarations: [UserGroupListComponent]
})

export class UserGroupListModule {}
