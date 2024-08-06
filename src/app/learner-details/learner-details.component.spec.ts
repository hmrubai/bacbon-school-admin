import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LearnerDetailsComponent } from './learner-details.component';

describe('LearnerDetailsComponent', () => {
  let component: LearnerDetailsComponent;
  let fixture: ComponentFixture<LearnerDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
