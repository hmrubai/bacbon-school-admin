import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VideoContentsSpentHourListComponent } from './video-contents-spent-hour-list.component';

describe('VideoContentsSpentHourListComponent', () => {
  let component: VideoContentsSpentHourListComponent;
  let fixture: ComponentFixture<VideoContentsSpentHourListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoContentsSpentHourListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoContentsSpentHourListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
