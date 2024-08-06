import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { VideoContentsSeenDetailsComponent } from './video-contents-seen-details.component';

describe('VideoContentsSeenDetailsComponent', () => {
  let component: VideoContentsSeenDetailsComponent;
  let fixture: ComponentFixture<VideoContentsSeenDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoContentsSeenDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoContentsSeenDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
