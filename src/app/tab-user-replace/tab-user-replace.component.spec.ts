import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TabUserReplaceComponent } from './tab-user-replace.component';

describe('TabUserReplaceComponent', () => {
  let component: TabUserReplaceComponent;
  let fixture: ComponentFixture<TabUserReplaceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TabUserReplaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TabUserReplaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
