import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LearnersCallListDetailComponent } from './learners-call-list-detail.component';

describe('LearnersCallListDetailComponent', () => {
  let component: LearnersCallListDetailComponent;
  let fixture: ComponentFixture<LearnersCallListDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LearnersCallListDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnersCallListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
