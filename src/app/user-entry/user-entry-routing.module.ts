import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {UserEntryComponent} from './user-entry.component';

const routes: Routes = [
  {
    path: '',
    component: UserEntryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserEntryRoutingModule { }
