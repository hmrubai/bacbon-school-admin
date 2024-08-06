import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CouponUsesHistoryComponent } from './coupon-uses-history.component';

describe('CouponUsesHistoryComponent', () => {
  let component: CouponUsesHistoryComponent;
  let fixture: ComponentFixture<CouponUsesHistoryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CouponUsesHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CouponUsesHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
