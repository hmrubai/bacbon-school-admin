import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {AddPaidCourseComponent} from './add-paid-course.component';

const routes: Routes = [
  {
    path: '',
    component: AddPaidCourseComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AddPaidCourseRoutingModule { }
