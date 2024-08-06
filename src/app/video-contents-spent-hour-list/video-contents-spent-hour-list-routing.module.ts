import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VideoContentsSpentHourListComponent} from './video-contents-spent-hour-list.component';

const routes: Routes = [
  {
    path: '',
    component: VideoContentsSpentHourListComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoContentsSpentHourListRoutingModule { }
