import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectionTestWrittenQuestionsComponent } from './selection-test-written-questions.component';

describe('SelectionTestWrittenQuestionsComponent', () => {
  let component: SelectionTestWrittenQuestionsComponent;
  let fixture: ComponentFixture<SelectionTestWrittenQuestionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionTestWrittenQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionTestWrittenQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
