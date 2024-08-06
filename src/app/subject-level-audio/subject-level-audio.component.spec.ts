import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubjectLevelAudioComponent } from './subject-level-audio.component';

describe('SubjectLevelAudioComponent', () => {
  let component: SubjectLevelAudioComponent;
  let fixture: ComponentFixture<SubjectLevelAudioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectLevelAudioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectLevelAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
