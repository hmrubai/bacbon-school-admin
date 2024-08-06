import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidCourseResultsComponent } from './paid-course-results.component';

describe('PaidCourseResultsComponent', () => {
  let component: PaidCourseResultsComponent;
  let fixture: ComponentFixture<PaidCourseResultsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidCourseResultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidCourseResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
