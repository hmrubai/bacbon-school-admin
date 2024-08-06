import { Routes } from '@angular/router';

import { UserGroupEntryComponent } from './user-group-entry.component';

export const UserGroupEntryRoutes: Routes = [{
  path: '',
  component: UserGroupEntryComponent,
  data: {
    breadcrumb: 'User Group',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
