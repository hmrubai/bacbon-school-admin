import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdatePaidCourseComponent } from './update-paid-course.component';

describe('PaidCourseComponent', () => {
  let component: UpdatePaidCourseComponent;
  let fixture: ComponentFixture<UpdatePaidCourseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePaidCourseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePaidCourseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
