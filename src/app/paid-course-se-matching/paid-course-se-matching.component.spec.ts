import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PaidCourseSEMacthingComponent } from './paid-course-se-matching.component';

describe('PaidCourseSEMacthingComponent', () => {
  let component: PaidCourseSEMacthingComponent;
  let fixture: ComponentFixture<PaidCourseSEMacthingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PaidCourseSEMacthingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaidCourseSEMacthingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
