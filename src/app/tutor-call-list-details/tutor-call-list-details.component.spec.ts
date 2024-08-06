import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TutorCallListDetailComponent } from './tutor-call-list-details.component';

describe('TutorCallListDetailComponent', () => {
  let component: TutorCallListDetailComponent;
  let fixture: ComponentFixture<TutorCallListDetailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TutorCallListDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TutorCallListDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
