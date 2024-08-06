import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidCourseTestQuestionsComponent } from './paid-course-test-questions.component';

describe('PaidCourseTestQuestionsComponent', () => {
  let component: PaidCourseTestQuestionsComponent;
  let fixture: ComponentFixture<PaidCourseTestQuestionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidCourseTestQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidCourseTestQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
