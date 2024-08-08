import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {PaidCourseSEMacthingComponent} from './paid-course-se-matching.component';

const routes: Routes = [
  {
    path: '',
    component: PaidCourseSEMacthingComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaidCourseSEMacthingRoutingModule { }
