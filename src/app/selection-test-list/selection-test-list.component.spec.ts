import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SelectionTestListComponent } from './selection-test-list.component';

describe('SelectionTestListComponent', () => {
  let component: SelectionTestListComponent;
  let fixture: ComponentFixture<SelectionTestListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectionTestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectionTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
