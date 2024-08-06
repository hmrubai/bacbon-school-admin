import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidCoursePurchasesComponent } from './paid-course-purchases.component';

describe('PaidCoursePurchasesComponent', () => {
  let component: PaidCoursePurchasesComponent;
  let fixture: ComponentFixture<PaidCoursePurchasesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidCoursePurchasesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidCoursePurchasesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
