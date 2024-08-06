import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubjectListPaidCourseMeterialsComponent } from './subject-list-paid-course-meterials.component';

describe('SubjectListPaidCourseMeterialsComponent', () => {
  let component: SubjectListPaidCourseMeterialsComponent;
  let fixture: ComponentFixture<SubjectListPaidCourseMeterialsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectListPaidCourseMeterialsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectListPaidCourseMeterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
