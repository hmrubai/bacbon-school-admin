import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidCourseTestComponent } from './paid-course-tests.component';

describe('PaidCourseTestComponent', () => {
  let component: PaidCourseTestComponent;
  let fixture: ComponentFixture<PaidCourseTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidCourseTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidCourseTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
