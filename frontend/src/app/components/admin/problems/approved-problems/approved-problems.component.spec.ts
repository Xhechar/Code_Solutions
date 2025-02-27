import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApprovedProblemsComponent } from './approved-problems.component';

describe('ApprovedProblemsComponent', () => {
  let component: ApprovedProblemsComponent;
  let fixture: ComponentFixture<ApprovedProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ApprovedProblemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ApprovedProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
