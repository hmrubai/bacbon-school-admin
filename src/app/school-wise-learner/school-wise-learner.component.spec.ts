import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SchoolWiseLearnerComponent } from './school-wise-learner.component';

describe('SchoolWiseLearnerComponent', () => {
  let component: SchoolWiseLearnerComponent;
  let fixture: ComponentFixture<SchoolWiseLearnerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolWiseLearnerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolWiseLearnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
