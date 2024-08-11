import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidCourseLCActivateComponent } from './paid-course-lc-activate.component';

describe('PaidCourseLCActivateComponent', () => {
  let component: PaidCourseLCActivateComponent;
  let fixture: ComponentFixture<PaidCourseLCActivateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidCourseLCActivateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidCourseLCActivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
