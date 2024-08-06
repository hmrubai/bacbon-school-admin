import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WrittenResultComponent } from './written-result.component';

describe('WrittenResultComponent', () => {
  let component: WrittenResultComponent;
  let fixture: ComponentFixture<WrittenResultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ WrittenResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrittenResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
