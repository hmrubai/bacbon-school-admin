import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {CouponUsesHistoryComponent} from './coupon-uses-history.component';

const routes: Routes = [
  {
    path: '',
    component: CouponUsesHistoryComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CouponUsesHistoryRoutingModule { }
