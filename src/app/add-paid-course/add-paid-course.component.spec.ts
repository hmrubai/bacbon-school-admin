import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AddPaidCourseComponent } from './add-paid-course.component';

describe('PaidCourseComponent', () => {
  let component: AddPaidCourseComponent;
  let fixture: ComponentFixture<AddPaidCourseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPaidCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPaidCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
