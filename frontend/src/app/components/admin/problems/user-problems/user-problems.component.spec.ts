import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserProblemsComponent } from './user-problems.component';

describe('UserProblemsComponent', () => {
  let component: UserProblemsComponent;
  let fixture: ComponentFixture<UserProblemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProblemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserProblemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
