import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaidCoursePurchasesComponent} from './paid-course-purchases.component';

const routes: Routes = [
  {
    path: '',
    component: PaidCoursePurchasesComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidCoursePurchasesRoutingModule { }
