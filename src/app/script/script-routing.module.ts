import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ScriptListComponent} from './script.component';

const routes: Routes = [
  {
    path: '',
    component: ScriptListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ScriptListRoutingModule { }
