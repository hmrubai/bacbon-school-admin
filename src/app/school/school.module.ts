import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

import { SchoolComponent } from './school.component';
import { SchoolRoutes } from './school.routing';
import { SharedModule } from '../theme/shared/shared.module';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
      CommonModule,
      RouterModule.forChild(SchoolRoutes),
      SharedModule,
      NgbTooltipModule
  ],
  declarations: [SchoolComponent]
})

export class SchoolModule {}
