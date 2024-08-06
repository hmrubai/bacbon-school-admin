import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SpentHoursComponent } from './spent-hours.component';

describe('SpentHoursComponent', () => {
  let component: SpentHoursComponent;
  let fixture: ComponentFixture<SpentHoursComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SpentHoursComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpentHoursComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
