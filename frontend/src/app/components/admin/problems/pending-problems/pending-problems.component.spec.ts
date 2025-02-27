import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingProblemsComponent } from './pending-problems.component';

describe('PendingProblemsComponent', () => {
  let component: PendingProblemsComponent;
  let fixture: ComponentFixture<PendingProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PendingProblemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PendingProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
