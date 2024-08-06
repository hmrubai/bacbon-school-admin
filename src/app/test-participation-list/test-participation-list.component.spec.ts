import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestParticipationListComponent } from './test-participation-list.component';

describe('TestParticipationListComponent', () => {
  let component: TestParticipationListComponent;
  let fixture: ComponentFixture<TestParticipationListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestParticipationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestParticipationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
