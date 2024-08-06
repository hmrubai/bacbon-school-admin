import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {VideoContentsSeenComponent} from './video-contents-seen.component';

const routes: Routes = [
  {
    path: '',
    component: VideoContentsSeenComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VideoContentsSeenRoutingModule { }
