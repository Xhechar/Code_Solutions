import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserPSComponent } from './user-ps.component';

describe('UserPSComponent', () => {
  let component: UserPSComponent;
  let fixture: ComponentFixture<UserPSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserPSComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserPSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
