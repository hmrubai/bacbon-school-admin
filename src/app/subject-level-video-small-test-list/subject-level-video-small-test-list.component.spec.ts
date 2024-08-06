import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubjectLevelVideoSmTestListComponent } from './subject-level-video-small-test-list.component';

describe('SubjectLevelVideoSmTestListComponent', () => {
  let component: SubjectLevelVideoSmTestListComponent;
  let fixture: ComponentFixture<SubjectLevelVideoSmTestListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubjectLevelVideoSmTestListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubjectLevelVideoSmTestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
