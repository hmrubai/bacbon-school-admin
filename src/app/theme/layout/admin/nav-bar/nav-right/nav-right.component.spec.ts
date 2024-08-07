import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NavRightComponent } from './nav-right.component';

describe('NavRightComponent', () => {
  let component: NavRightComponent;
  let fixture: ComponentFixture<NavRightComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NavRightComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
