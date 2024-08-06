import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SmallTestListComponent } from './small-test-list.component';

describe('SmallTestListComponent', () => {
  let component: SmallTestListComponent;
  let fixture: ComponentFixture<SmallTestListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SmallTestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmallTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
