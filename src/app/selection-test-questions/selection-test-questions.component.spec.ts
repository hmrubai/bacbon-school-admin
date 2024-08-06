import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectionTestQuestionsComponent } from './selection-test-questions.component';

describe('SelectionTestQuestionsComponent', () => {
  let component: SelectionTestQuestionsComponent;
  let fixture: ComponentFixture<SelectionTestQuestionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionTestQuestionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionTestQuestionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
