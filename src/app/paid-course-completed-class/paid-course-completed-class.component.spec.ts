import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidCourseCompletedClassComponent } from './paid-course-completed-class.component';

describe('PaidCourseCompletedClassComponent', () => {
  let component: PaidCourseCompletedClassComponent;
  let fixture: ComponentFixture<PaidCourseCompletedClassComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidCourseCompletedClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidCourseCompletedClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
