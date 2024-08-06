import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VideoContentsSeenComponent } from './video-contents-seen.component';

describe('VideoContentsSeenComponent', () => {
  let component: VideoContentsSeenComponent;
  let fixture: ComponentFixture<VideoContentsSeenComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoContentsSeenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoContentsSeenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
