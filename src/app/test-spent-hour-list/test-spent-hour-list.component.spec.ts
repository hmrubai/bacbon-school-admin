import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestSpentHourListComponent } from './test-spent-hour-list.component';

describe('TestSpentHourListComponent', () => {
  let component: TestSpentHourListComponent;
  let fixture: ComponentFixture<TestSpentHourListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestSpentHourListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestSpentHourListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
