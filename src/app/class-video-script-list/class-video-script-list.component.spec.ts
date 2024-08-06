import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ClassVideoScriptListComponent } from './class-video-script-list.component';

describe('ClassVideoScriptListComponent', () => {
  let component: ClassVideoScriptListComponent;
  let fixture: ComponentFixture<ClassVideoScriptListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassVideoScriptListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassVideoScriptListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
