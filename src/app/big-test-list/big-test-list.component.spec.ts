import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BigTestListComponent } from './big-test-list.component';

describe('BigTestListComponent', () => {
  let component: BigTestListComponent;
  let fixture: ComponentFixture<BigTestListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BigTestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BigTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
