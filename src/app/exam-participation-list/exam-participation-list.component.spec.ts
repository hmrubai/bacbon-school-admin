import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExamParticipationListComponent } from './exam-participation-list.component';

describe('ExamParticipationListComponent', () => {
  let component: ExamParticipationListComponent;
  let fixture: ComponentFixture<ExamParticipationListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExamParticipationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamParticipationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
