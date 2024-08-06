import { Routes } from '@angular/router';

import { InstructionAudiosComponent } from './instruction-audios.component';

export const InstructionAudiosRoutes: Routes = [{
  path: '',
  component: InstructionAudiosComponent,
  data: {
    breadcrumb: 'Trainee Wise Course Study Report',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
