import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScriptSpentHourListComponent } from './script-spent-hour-list.component';

describe('ScriptSpentHourListComponent', () => {
  let component: ScriptSpentHourListComponent;
  let fixture: ComponentFixture<ScriptSpentHourListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScriptSpentHourListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScriptSpentHourListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
