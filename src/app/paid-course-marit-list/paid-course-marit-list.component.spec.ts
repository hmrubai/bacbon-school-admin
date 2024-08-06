import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidCourseMaritListComponent } from './paid-course-marit-list.component';

describe('PaidCourseMaritListComponent', () => {
  let component: PaidCourseMaritListComponent;
  let fixture: ComponentFixture<PaidCourseMaritListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidCourseMaritListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidCourseMaritListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
