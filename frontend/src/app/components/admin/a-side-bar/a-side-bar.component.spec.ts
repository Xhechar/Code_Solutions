import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ASideBarComponent } from './a-side-bar.component';

describe('ASideBarComponent', () => {
  let component: ASideBarComponent;
  let fixture: ComponentFixture<ASideBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ASideBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ASideBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
