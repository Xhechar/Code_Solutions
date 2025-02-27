import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProblemsComponent } from './all-problems.component';

describe('AllProblemsComponent', () => {
  let component: AllProblemsComponent;
  let fixture: ComponentFixture<AllProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllProblemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
