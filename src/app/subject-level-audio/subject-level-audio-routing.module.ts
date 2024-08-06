import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {SubjectLevelAudioComponent} from './subject-level-audio.component';

const routes: Routes = [
  {
    path: '',
    component: SubjectLevelAudioComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SubjectLevelAudioRoutingModule { }
