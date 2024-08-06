import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidCourseQuotaComponent } from './paid-course-quota.component';

describe('PaidCourseQuotaComponent', () => {
  let component: PaidCourseQuotaComponent;
  let fixture: ComponentFixture<PaidCourseQuotaComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidCourseQuotaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidCourseQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
