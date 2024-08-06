import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SchoolWiseSpentHoursReportComponent } from './school-wise-spent-hours-report.component';

describe('SchoolWiseSpentHoursReportComponent', () => {
  let component: SchoolWiseSpentHoursReportComponent;
  let fixture: ComponentFixture<SchoolWiseSpentHoursReportComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SchoolWiseSpentHoursReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolWiseSpentHoursReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
