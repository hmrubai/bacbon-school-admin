import { Routes } from '@angular/router';

import { UserGroupListComponent } from './user-group-list.component';

export const UserGroupListRoutes: Routes = [{
  path: '',
  component: UserGroupListComponent,
  data: {
    breadcrumb: 'User Group List',
    icon: 'icofont-home bg-c-blue',
    status: false
  }
}];
