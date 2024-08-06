import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidCourseSubjectsComponent } from './paid-course-subjects.component';

describe('PaidCourseSubjectsComponent', () => {
  let component: PaidCourseSubjectsComponent;
  let fixture: ComponentFixture<PaidCourseSubjectsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidCourseSubjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidCourseSubjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
