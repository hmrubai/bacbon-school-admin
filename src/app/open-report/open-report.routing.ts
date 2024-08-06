import { Routes } from '@angular/router';

import { OpenReportComponent } from './open-report.component';

export const OpenReportRoutes: Routes = [{
  path: '',
  component: OpenReportComponent,
  data: {
    breadcrumb: 'Trainee Wise Course Study Report',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
