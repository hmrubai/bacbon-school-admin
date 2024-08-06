import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidCourseMentorsComponent } from './paid-course-mentors.component';

describe('PaidCourseMentorsComponent', () => {
  let component: PaidCourseMentorsComponent;
  let fixture: ComponentFixture<PaidCourseMentorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidCourseMentorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidCourseMentorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
