import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WrittenResultComponent} from './written-result.component';

const routes: Routes = [
  {
    path: '',
    component: WrittenResultComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WrittenResultRoutingModule { }
