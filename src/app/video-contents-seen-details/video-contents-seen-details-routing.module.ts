import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VideoContentsSeenDetailsComponent} from './video-contents-seen-details.component';

const routes: Routes = [
  {
    path: '',
    component: VideoContentsSeenDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoContentsSeenDetailsRoutingModule { }
