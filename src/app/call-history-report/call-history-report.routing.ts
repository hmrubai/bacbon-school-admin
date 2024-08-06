import { Routes } from '@angular/router';

import { CallHistoryReportComponent } from './call-history-report.component';

export const CallHistoryReportRoutes: Routes = [{
  path: '',
  component: CallHistoryReportComponent,
  data: {
    breadcrumb: 'Trainee Wise Course Study Report',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
