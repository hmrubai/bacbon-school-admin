import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubjectLevelBigTestListComponent } from './subject-level-big-test-list.component';

describe('SubjectLevelBigTestListComponent', () => {
  let component: SubjectLevelBigTestListComponent;
  let fixture: ComponentFixture<SubjectLevelBigTestListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectLevelBigTestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectLevelBigTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
