import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BigTestQuestionAnswerListComponent } from './big-test-question-answer-list.component';

describe('BigTestQuestionAnswerListComponent', () => {
  let component: BigTestQuestionAnswerListComponent;
  let fixture: ComponentFixture<BigTestQuestionAnswerListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BigTestQuestionAnswerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BigTestQuestionAnswerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
