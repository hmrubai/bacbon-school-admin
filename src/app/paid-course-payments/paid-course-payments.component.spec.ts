import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidCoursePaymentsComponent } from './paid-course-payments.component';

describe('PaidCoursePaymentsComponent', () => {
  let component: PaidCoursePaymentsComponent;
  let fixture: ComponentFixture<PaidCoursePaymentsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidCoursePaymentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidCoursePaymentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
