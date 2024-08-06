import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExamSpentHourListComponent } from './exam-spent-hour-list.component';

describe('ExamSpentHourListComponent', () => {
  let component: ExamSpentHourListComponent;
  let fixture: ComponentFixture<ExamSpentHourListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamSpentHourListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamSpentHourListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
