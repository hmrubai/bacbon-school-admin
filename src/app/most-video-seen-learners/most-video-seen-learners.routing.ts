import { Routes } from '@angular/router';

import { MostVideoSeenLearnersComponent } from './most-video-seen-learners.component';

export const MostVideoSeenLearnersRoutes: Routes = [{
  path: '',
  component: MostVideoSeenLearnersComponent,
  data: {
    breadcrumb: 'Trainee Wise Course Study Report',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
