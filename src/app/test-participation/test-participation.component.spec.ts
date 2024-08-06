import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TestParticipationComponent } from './test-participation.component';

describe('TestParticipationComponent', () => {
  let component: TestParticipationComponent;
  let fixture: ComponentFixture<TestParticipationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TestParticipationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestParticipationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
