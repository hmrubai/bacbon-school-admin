import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DailyQuizListComponent } from './daily-quiz-list.component';

describe('DailyQuizListComponent', () => {
  let component: DailyQuizListComponent;
  let fixture: ComponentFixture<DailyQuizListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyQuizListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyQuizListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
