import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExamParticipationComponent } from './exam-participation.component';

describe('ExamParticipationComponent', () => {
  let component: ExamParticipationComponent;
  let fixture: ComponentFixture<ExamParticipationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamParticipationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
