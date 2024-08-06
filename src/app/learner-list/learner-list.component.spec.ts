import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LearnerListComponent } from './learner-list.component';

describe('LearnerListComponent', () => {
  let component: LearnerListComponent;
  let fixture: ComponentFixture<LearnerListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnerListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
