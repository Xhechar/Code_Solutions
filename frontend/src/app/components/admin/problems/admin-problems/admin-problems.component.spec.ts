import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminProblemsComponent } from './admin-problems.component';

describe('AdminProblemsComponent', () => {
  let component: AdminProblemsComponent;
  let fixture: ComponentFixture<AdminProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminProblemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
