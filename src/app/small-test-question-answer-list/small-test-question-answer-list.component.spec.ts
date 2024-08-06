import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmallTestQuestionAnswerListComponent } from './small-test-question-answer-list.component';

describe('SmallTestQuestionAnswerListComponent', () => {
  let component: SmallTestQuestionAnswerListComponent;
  let fixture: ComponentFixture<SmallTestQuestionAnswerListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallTestQuestionAnswerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallTestQuestionAnswerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
